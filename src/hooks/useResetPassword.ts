import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting password reset process");
    
    if (!validatePasswords()) return;

    setIsLoading(true);
    console.log("Attempting to update password with Supabase");

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Password updated successfully");
      toast({
        title: "Success",
        description: "Password has been reset successfully",
      });
      
      // Wait for toast to be visible before redirecting
      setTimeout(() => {
        navigate("/reset-password-success", { replace: true });
      }, 1000);
      
    } catch (error: any) {
      console.error("Error in password reset:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    handleResetPassword,
  };
};