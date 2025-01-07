import { supabase } from "@/integrations/supabase/client";

export const sendOtpEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // Only allow existing users
      },
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    throw {
      message: error.message || "Failed to send OTP",
      status: error.status || 500,
    };
  }
};

export const verifyOtpCode = async (email: string, token: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    throw {
      message: error.message || "Failed to verify OTP",
      status: error.status || 500,
    };
  }
};