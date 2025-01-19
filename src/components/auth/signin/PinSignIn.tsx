import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getContactType } from "@/utils/otpValidation";
import { sendOtpEmail, verifyOtpCode } from "@/utils/otpUtils";
import { ContactInputStep } from "./ContactInputStep";
import { OtpVerificationStep } from "./OtpVerificationStep";

interface OtpSignInProps {
  isLoading: boolean;
}

export const PinSignIn = ({
  isLoading: externalLoading,
}: OtpSignInProps) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [contact, setContact] = useState("");
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setTimeout(() => {
        setCooldownTime(time => time - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [cooldownTime]);

  const handleSendOtp = useCallback(async () => {
    if (isLoading || externalLoading || cooldownTime > 0) {
      if (cooldownTime > 0) {
        toast({
          title: "Please wait",
          description: `You can request another OTP in ${cooldownTime} seconds`,
          variant: "destructive",
        });
      }
      return;
    }

    const contactValue = contact.trim();
    
    if (/^\d+$/.test(contactValue)) {
      toast({
        title: "Phone Authentication Coming Soon",
        description: "Currently, only email authentication is available. Please use your email address.",
        variant: "default",
      });
      return;
    }

    const contactType = getContactType(contactValue);
    
    if (contactType === 'invalid') {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await sendOtpEmail(contactValue);
      toast({
        title: "Success",
        description: "Please check your email for the verification code",
      });
      setOtpSent(true);
      setCooldownTime(60);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      
      if (error.status === 404) {
        toast({
          title: "Account Not Found",
          description: error.message || "No account exists with this email address. Please sign up first.",
          variant: "destructive",
        });
      } else if (error.status === 429) {
        setCooldownTime(60);
        toast({
          title: "Too Many Attempts",
          description: "Please wait a minute before requesting another OTP",
          variant: "destructive",
        });
      } else if (error.status === 422) {
        toast({
          title: "OTP Not Available",
          description: error.message || "Email OTP authentication is not enabled. Please use password authentication.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to send OTP",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [contact, cooldownTime, isLoading, externalLoading, toast]);

  const handleVerifyOtp = async () => {
    if (isLoading || externalLoading) return;

    setIsLoading(true);
    try {
      await verifyOtpCode(contact.trim(), otp);
      toast({
        title: "Success",
        description: "Successfully verified OTP",
      });
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to verify OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {otpSent ? (
        <OtpVerificationStep
          otp={otp}
          setOtp={setOtp}
          handleVerifyOtp={handleVerifyOtp}
          handleResendOtp={handleSendOtp}
          isLoading={isLoading || externalLoading}
          cooldownTime={cooldownTime}
        />
      ) : (
        <ContactInputStep
          contact={contact}
          setContact={setContact}
          handleSendOtp={handleSendOtp}
          isLoading={isLoading || externalLoading || cooldownTime > 0}
        />
      )}
    </div>
  );
};