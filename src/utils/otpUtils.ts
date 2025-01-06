import { supabase } from "@/integrations/supabase/client";

export const sendOtpEmail = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/app`,
      }
    });

    if (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }

    // Return only necessary data to prevent response stream issues
    return {
      success: true,
      message: "OTP sent successfully"
    };
  } catch (error) {
    console.error("Error in sendOtpEmail:", error);
    throw error;
  }
};

export const verifyOtpCode = async (email: string, token: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });

    if (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }

    // Return only necessary data to prevent response stream issues
    return {
      success: true,
      session: data.session
    };
  } catch (error) {
    console.error("Error in verifyOtpCode:", error);
    throw error;
  }
};