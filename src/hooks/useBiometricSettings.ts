import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useBiometricAuth } from "./useBiometricAuth";
import { 
  updateBiometricCredentials, 
  disableBiometricAuth, 
  createBiometricNotification,
  isBiometricSupported 
} from "@/utils/biometricUtils";
import { BiometricCredentials } from "@/types/biometric";
import { supabase } from "@/integrations/supabase/client";

export const useBiometricSettings = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { enrollBiometric } = useBiometricAuth();

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
      if (!isBiometricSupported()) {
        toast({
          title: "Not Supported",
          description: "Biometric authentication is not supported on this device",
          variant: "destructive",
        });
        return;
      }

      try {
        const credential = await enrollBiometric();
        
        if (!credential || typeof credential !== 'object') {
          throw new Error("Invalid credential response");
        }

        const biometricCredential = credential as unknown as BiometricCredentials;
        
        if (!biometricCredential.id || !biometricCredential.type) {
          throw new Error("Invalid credential response");
        }
        
        const serializedCredentials = {
          id: biometricCredential.id,
          type: biometricCredential.type,
          email: user.email!,
          rawId: Array.from(new Uint8Array((credential as any).rawId))
        };
        
        await updateBiometricCredentials(user.id, serializedCredentials);
        await createBiometricNotification(user.id, true);

        setBiometricEnabled(true);
        toast({
          title: "Success",
          description: "Biometric authentication enabled",
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
        await disableBiometricAuth(user.id);
        await createBiometricNotification(user.id, false);

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