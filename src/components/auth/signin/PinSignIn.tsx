import { useState } from "react";
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
  const { toast } = useToast();

  const handleSendOtp = async () => {
    try {
      const contactValue = contact.trim();
      const contactType = getContactType(contactValue);
      
      switch (contactType) {
        case 'email':
          await sendOtpEmail(contactValue);
          toast({
            title: "OTP Sent",
            description: "Please check your email for the verification code",
          });
          setOtpSent(true);
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
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
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
          isLoading={isLoading}
        />
      )}
    </div>
  );
};