import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (
    fullName: string,
    email: string,
    password: string,
    phoneNumber: string
  ) => {
    setIsLoading(true);

    try {
      const [firstName, ...lastNameParts] = fullName.trim().split(" ");
      const lastName = lastNameParts.join(" ");

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName || null,
            phone_number: phoneNumber,
          },
          emailRedirectTo: `${window.location.origin}/signin`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        localStorage.setItem("isFirstTimeUser", "true");
        localStorage.setItem("tempSignUpPassword", password); // Store password temporarily
        
        // Set a timeout to remove the temporary password after 1 hour
        setTimeout(() => {
          localStorage.removeItem("tempSignUpPassword");
        }, 3600000); // 1 hour in milliseconds
        
        return true;
      }

      return false;
    } catch (error: any) {
      console.error("Unexpected error during signup:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignUp,
  };
};