import { supabase } from "@/integrations/supabase/client";

export const sendOtpEmail = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      data: {
        email,
      },
    }
  });

  if (error) throw error;
};

export const verifyOtpCode = async (email: string, token: string) => {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  });

  if (error) throw error;
};