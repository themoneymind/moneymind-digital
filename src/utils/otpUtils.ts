import { supabase } from "@/integrations/supabase/client";

export const sendOtpEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/app`,
      }
    });

    if (error) {
      // Handle rate limit error specifically
      if (error.message?.includes('rate limit') || error.status === 429) {
        throw {
          status: 429,
          message: "Email rate limit exceeded. Please wait a minute before requesting another OTP."
        };
      }
      throw error;
    }

    return {
      success: true,
      message: "OTP sent successfully"
    };
  } catch (error: any) {
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
      throw error;
    }

    return {
      success: true,
      session: data.session
    };
  } catch (error: any) {
    console.error("Error in verifyOtpCode:", error);
    throw error;
  }
};