import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useOtpSignIn = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [contact, setContact] = useState("");
  const [cooldownTime, setCooldownTime] = useState(0);
  const { toast } = useToast();

  const handleSendOtp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: contact,
      });

      if (error) {
        if (error.message.includes("Email rate limit exceeded")) {
          toast({
            title: "Error",
            description: "Please wait a few minutes before requesting another OTP",
            variant: "destructive",
          });
        } else if (error.message.includes("Unable to validate email address")) {
          toast({
            title: "Error",
            description: "This email is not registered. Please sign up first or use password authentication.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      setOtpSent(true);
      setCooldownTime(60);

      const interval = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "Success",
        description: "OTP sent successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: contact,
        token: otp,
        type: "email",
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Successfully signed in!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    otpSent,
    otp,
    setOtp,
    contact,
    setContact,
    handleSendOtp,
    handleVerifyOtp,
    cooldownTime,
  };
};