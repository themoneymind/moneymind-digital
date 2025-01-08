import { AuthError } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

export const sendOtpEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // Only allow existing users
      },
    });
    
    if (error) {
      // Handle specific Supabase auth errors
      if (error.message.includes('User not found')) {
        throw {
          message: "No account exists with this email address. Please sign up first.",
          status: 404,
        };
      }
      
      // Handle OTP disabled error
      if (error.message.includes('otp_disabled') || error.message.includes('Signups not allowed for otp')) {
        throw {
          message: "Email OTP authentication is not enabled. Please contact support or use password authentication.",
          status: 422,
        };
      }
      
      throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    
    // Format the error response consistently
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