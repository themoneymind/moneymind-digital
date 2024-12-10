import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
        handleSignUpError(error);
        return false;
      }

      if (data?.user) {
        handleSignUpSuccess();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpError = (error: any) => {
    console.error("Signup error:", error);
    
    if (error.status === 429) {
      toast({
        title: "Please wait",
        description: "Too many signup attempts. Please try again in a few minutes.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  };

  const handleSignUpSuccess = () => {
    localStorage.setItem("isFirstTimeUser", "true");
    
    toast({
      title: "Success!",
      description: "Please check your email to verify your account. Then you can sign in.",
    });
    
    setTimeout(() => {
      navigate("/signin");
    }, 3000);
  };

  return {
    isLoading,
    handleSignUp,
  };
};