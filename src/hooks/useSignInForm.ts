import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSignInForm = () => {
  const [activeTab, setActiveTab] = useState("password");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("rememberMe") === "true";
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBiometricLogin = async () => {
    try {
      const rememberedEmail = localStorage.getItem("rememberedEmail");
      
      if (!rememberedEmail) {
        toast({
          title: "Error",
          description: "Please sign in with password first and enable 'Remember me' to use biometric login",
          variant: "destructive",
        });
        return;
      }

      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: rememberedEmail,
        password: "",
      });

      if (error) throw error;

      if (!user) {
        throw new Error("No user data received");
      }

      toast({
        title: "Success",
        description: "Successfully signed in with biometrics",
      });

      navigate("/app");
    } catch (error: any) {
      console.error("Biometric login error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with biometrics",
        variant: "destructive",
      });
    }
  };

  return {
    activeTab,
    setActiveTab,
    biometricAvailable,
    setBiometricAvailable,
    handleBiometricLogin,
    rememberMe,
    setRememberMe,
  };
};