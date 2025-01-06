import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getContactType } from "@/utils/otpValidation";
import { sendOtpEmail, verifyOtpCode } from "@/utils/otpUtils";
import { ContactInputStep } from "./ContactInputStep";
import { OtpVerificationStep } from "./OtpVerificationStep";

interface OtpSignInProps {
  isLoading: boolean;
}

export const PinSignIn = ({
  isLoading,
}: OtpSignInProps) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [contact, setContact] = useState("");
  const [cooldownTime, setCooldownTime] = useState(0);
  const { toast } = useToast();

  // Handle cooldown timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(time => time - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const handleSendOtp = async () => {
    try {
      // Check if in cooldown
      if (cooldownTime > 0) {
        toast({
          title: "Please wait",
          description: `You can request another OTP in ${cooldownTime} seconds`,
          variant: "destructive",
        });
        return;
      }

      const contactValue = contact.trim();
      const contactType = getContactType(contactValue);
      
      switch (contactType) {
        case 'email':
          try {
            await sendOtpEmail(contactValue);
            toast({
              title: "OTP Sent",
              description: "Please check your email for the verification code",
            });
            setOtpSent(true);
            // Set 60 second cooldown after successful send
            setCooldownTime(60);
          } catch (error: any) {
            console.error("Error sending OTP:", error);
            
            // Handle rate limit error specifically
            if (error.status === 429) {
              setCooldownTime(60); // Force cooldown on rate limit
              toast({
                title: "Too Many Attempts",
                description: "Please wait a minute before requesting another OTP",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Error",
                description: error.message || "Failed to send OTP",
                variant: "destructive",
              });
            }
          }
          break;

        case 'phone':
          toast({
            title: "Coming Soon",
            description: "Phone number verification will be available soon!",
            variant: "destructive",
          });
          return;

        case 'invalid':
          toast({
            title: "Invalid Input",
            description: "Please enter a valid email address or phone number",
            variant: "destructive",
          });
          return;
      }
    } catch (error: any) {
      console.error("Error in handleSendOtp:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async () => {
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
    }
  };

  return (
    <div className="space-y-6">
      {otpSent ? (
        <OtpVerificationStep
          otp={otp}
          setOtp={setOtp}
          handleVerifyOtp={handleVerifyOtp}
          isLoading={isLoading}
        />
      ) : (
        <ContactInputStep
          contact={contact}
          setContact={setContact}
          handleSendOtp={handleSendOtp}
          isLoading={isLoading || cooldownTime > 0}
        />
      )}
    </div>
  );
};