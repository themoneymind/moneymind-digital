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
        if (error.status === 429) {
          toast({
            title: "Too many attempts",
            description: "Please wait a few minutes before trying again.",
            variant: "destructive",
          });
          return false;
        }
        
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data?.user) {
        localStorage.setItem("isFirstTimeUser", "true");
        
        toast({
          title: "Success!",
          description: "Please check your email to verify your account. Then you can sign in.",
        });
        
        // Give user time to read the success message
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
        
        return true;
      }

      return false;
    } catch (error: any) {
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

  return {
    isLoading,
    handleSignUp,
  };
};