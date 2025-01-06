import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ResetDataDialog } from "./ResetDataDialog";
import { useNavigate } from "react-router-dom";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeyRound, Fingerprint } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export const SecuritySettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isBiometricSupported, enrollBiometric } = useBiometricAuth();
  const [biometricEnabled, setBiometricEnabled] = useState(false);

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

  const handleResetPassword = () => {
    navigate("/reset-password");
  };

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
        const credentials = await enrollBiometric();
        
        // Serialize the credential object to JSON-compatible format
        const serializedCredentials = {
          id: credentials.id,
          type: credentials.type,
          authenticatorAttachment: credentials.authenticatorAttachment,
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
      // Disable biometric
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

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-white rounded-apple">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Account Security</CardTitle>
          <CardDescription className="text-gray-500">
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-50 rounded-lg h-11"
            onClick={handleResetPassword}
          >
            <KeyRound className="w-4 h-4 mr-2" />
            Reset Password
          </Button>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Biometric Login</p>
                <p className="text-sm text-gray-500">
                  Use fingerprint or face ID to login
                </p>
              </div>
            </div>
            <Switch
              checked={biometricEnabled}
              onCheckedChange={handleBiometricToggle}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none bg-white rounded-apple">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold text-red-600">Danger Zone</CardTitle>
          <CardDescription className="text-gray-500 mt-1">
            Actions here can't be undone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetDataDialog />
        </CardContent>
      </Card>
    </div>
  );
};