import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getContactType } from "@/utils/otpValidation";

export const useOtpAuth = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [contact, setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const contactValue = contact.trim();
      const contactType = getContactType(contactValue);
      
      switch (contactType) {
        case 'email':
          const { error } = await supabase.auth.signInWithOtp({
            email: contactValue,
            options: {
              emailRedirectTo: `${window.location.origin}/signin`
            }
          });

          if (error) {
            console.error("OTP send error:", error);
            throw error;
          }

          toast({
            title: "OTP Sent",
            description: "Please check your email for the login code",
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        email: contact.trim(),
        token: otp,
        type: 'email'
      });

      if (error) throw error;

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

  return {
    otpSent,
    setOtpSent,
    otp,
    setOtp,
    contact,
    setContact,
    isLoading,
    handleSendOtp,
    handleVerifyOtp,
  };
};