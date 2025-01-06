import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export const SecuritySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleBiometricToggle = async () => {
    if (!user) return;

    try {
      if (!biometricEnabled) {
        // Request biometric credentials
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: {
              name: "Your App",
              id: window.location.hostname,
            },
            user: {
              id: new Uint8Array(16),
              name: user.email || "",
              displayName: user.email || "",
            },
            pubKeyCredParams: [
              {
                type: "public-key",
                alg: -7,
              },
            ],
            timeout: 60000,
            attestation: "direct",
          },
        });

        if (credential) {
          // Convert credential to a JSON-serializable object
          const credentialJSON = {
            id: credential.id,
            type: credential.type,
            // Add any other necessary properties that are JSON-serializable
          };

          const { error } = await supabase
            .from("profiles")
            .update({
              biometric_credentials: credentialJSON,
            })
            .eq("id", user.id);

          if (error) throw error;

          setBiometricEnabled(true);
          toast({
            title: "Success",
            description: "Biometric authentication enabled",
          });
        }
      } else {
        // Disable biometric
        const { error } = await supabase
          .from("profiles")
          .update({
            biometric_credentials: null,
          })
          .eq("id", user.id);

        if (error) throw error;

        setBiometricEnabled(false);
        toast({
          title: "Success",
          description: "Biometric authentication disabled",
        });
      }
    } catch (error) {
      console.error("Error toggling biometric:", error);
      toast({
        title: "Error",
        description: "Failed to toggle biometric authentication",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Biometric Authentication</Label>
          <p className="text-sm text-gray-500">
            Enable biometric authentication for secure access
          </p>
        </div>
        <Switch
          checked={biometricEnabled}
          onCheckedChange={handleBiometricToggle}
        />
      </div>
    </div>
  );
};