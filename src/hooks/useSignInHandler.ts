import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSignInHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (email: string, password: string) => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Starting sign in process with email:", email.trim());
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Sign in error details:", error);
        
        if (error.message?.includes("Email not confirmed")) {
          toast({
            title: "Email Not Verified",
            description: "Please check your email and verify your account before signing in.",
            variant: "destructive",
          });
        } else if (error.message?.includes("Invalid login credentials")) {
          toast({
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect. Please try again.",
            variant: "destructive",
          });
        } else if (error.status === 400) {
          toast({
            title: "Sign In Failed",
            description: "Please make sure you've confirmed your email and are using the correct password.",
            variant: "destructive",
          });
        } else if (error.status === 429) {
          toast({
            title: "Too Many Attempts",
            description: "Please wait a few minutes before trying again for security purposes.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      if (!data?.user) {
        console.error("No user data received");
        toast({
          title: "Error",
          description: "Unable to sign in. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Check if email is verified
      if (!data.user.email_confirmed_at) {
        toast({
          title: "Email Not Verified",
          description: "Please check your email and verify your account before signing in.",
          variant: "destructive",
        });
        navigate("/signup");
        return;
      }

      // Check if this is a first-time user
      const { data: sources } = await supabase
        .from("payment_sources")
        .select("id")
        .eq("user_id", data.user.id)
        .limit(1);

      const isFirstTimeUser = !sources || sources.length === 0;
      
      if (isFirstTimeUser) {
        localStorage.setItem("isFirstTimeUser", "true");
      } else {
        localStorage.removeItem("isFirstTimeUser");
      }

      console.log("Sign in successful:", data.user);
      toast({
        title: "Success",
        description: "Successfully signed in",
      });
      
      // Redirect based on user status
      if (isFirstTimeUser) {
        navigate("/app/payment-source");
      } else {
        navigate("/app");
      }
      
    } catch (error: any) {
      console.error("Unexpected sign in error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignIn, isLoading };
};