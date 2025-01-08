import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getContactType } from "@/utils/otpValidation";
import { sendOtpEmail, verifyOtpCode } from "@/utils/otpUtils";

export const useOtpSignIn = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [contact, setContact] = useState("");
  const [cooldownTime, setCooldownTime] = useState(0);
  const { toast } = useToast();

  const handleSendOtp = async () => {
    try {
      if (cooldownTime > 0) {
        toast({
          title: "Please wait",
          description: `You can request another OTP in ${cooldownTime} seconds`,
          variant: "destructive",
        });
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
      
      if (contactType === 'email') {
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
              description: "No account exists with this email address. Please sign up first.",
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
              description: "Email OTP authentication is not enabled. Please use password authentication.",
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
      } else {
        toast({
          title: "Invalid Input",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
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

  return {
    otpSent,
    setOtpSent,
    otp,
    setOtp,
    contact,
    setContact,
    cooldownTime,
    setCooldownTime,
    handleSendOtp,
    handleVerifyOtp,
  };
};