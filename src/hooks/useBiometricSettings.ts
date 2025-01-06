import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useBiometricAuth } from "./useBiometricAuth";

export const useBiometricSettings = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isBiometricSupported, enrollBiometric } = useBiometricAuth();

  useEffect(() => {
    const fetchBiometricSettings = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("biometric_credentials, preferred_auth_method")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setBiometricEnabled(
            data.preferred_auth_method === "biometric" && 
            data.biometric_credentials !== null
          );
        }
      }
    };

    fetchBiometricSettings();
  }, [user]);

  const handleBiometricToggle = async (checked: boolean) => {
    if (!user) return;

    if (checked && !biometricEnabled) {
      if (!isBiometricSupported) {
        toast({
          title: "Not Supported",
          description: "Biometric authentication is not supported on this device",
          variant: "destructive",
        });
        return;
      }

      try {
        const credential = await enrollBiometric();
        
        // Create a JSON-serializable object from the credentials
        const serializedCredentials = {
          id: credential.id,
          type: credential.type,
          // Convert ArrayBuffer to array for storage
          rawId: Array.from(new Uint8Array((credential as any).rawId))
        };
        
        const { error } = await supabase
          .from("profiles")
          .update({
            biometric_credentials: serializedCredentials,
            preferred_auth_method: "biometric"
          })
          .eq("id", user.id);

        if (error) throw error;

        setBiometricEnabled(true);
        toast({
          title: "Success",
          description: "Biometric authentication enabled",
        });

        await supabase.from("notifications").insert({
          user_id: user.id,
          message: "Biometric authentication has been enabled for your account",
          type: "security_update"
        });

      } catch (error) {
        console.error("Error enabling biometric:", error);
        toast({
          title: "Error",
          description: "Failed to enable biometric authentication",
          variant: "destructive",
        });
        return;
      }
    } else if (!checked && biometricEnabled) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({
            biometric_credentials: null,
            preferred_auth_method: "password"
          })
          .eq("id", user.id);

        if (error) throw error;

        setBiometricEnabled(false);
        toast({
          title: "Success",
          description: "Biometric authentication disabled",
        });
      } catch (error) {
        console.error("Error disabling biometric:", error);
        toast({
          title: "Error",
          description: "Failed to disable biometric authentication",
          variant: "destructive",
        });
      }
    }
  };

  return {
    biometricEnabled,
    handleBiometricToggle,
    isBiometricSupported
  };
};