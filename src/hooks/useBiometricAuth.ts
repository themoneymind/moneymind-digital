import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BiometricCredentials } from "@/types/biometric";
import { 
  getAuthenticatedUserId, 
  verifyBiometricCredentials,
  getAuthChallenge,
  verifyBiometricAssertion
} from "@/utils/biometricOperations";

export const useBiometricAuth = () => {
  const [authenticating, setAuthenticating] = useState(false);
  const { toast } = useToast();

  const startBiometricAuth = async (onSuccess: () => void) => {
    if (!window.PublicKeyCredential) {
      toast({
        title: "Error",
        description: "Biometric authentication is not supported on this device",
        variant: "destructive",
      });
      return;
    }

    setAuthenticating(true);

    try {
      // Get authenticated user ID
      const userId = await getAuthenticatedUserId();
      
      // Verify biometric credentials exist
      const biometricCredentials = await verifyBiometricCredentials(userId);
      
      // Get authentication challenge
      const challenge = await getAuthChallenge();

      // Create authentication options
      const options: PublicKeyCredentialRequestOptions = {
        challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
        allowCredentials: [{
          id: Uint8Array.from(atob(biometricCredentials.credentialId), c => c.charCodeAt(0)),
          type: 'public-key',
          transports: ['internal'] as AuthenticatorTransport[]
        }],
        timeout: 60000,
        userVerification: "required",
        rpId: window.location.hostname,
      };

      // Get credential
      const credential = await navigator.credentials.get({
        publicKey: options
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error("No credential received");
      }

      // Verify the assertion
      await verifyBiometricAssertion(credential, challenge);

      // Sign in with stored credentials
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: biometricCredentials.email,
        password: biometricCredentials.password,
      });

      if (signInError) throw signInError;
      if (!session) throw new Error("No session created");

      toast({
        title: "Success",
        description: "Successfully authenticated with biometrics",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Biometric authentication error:", error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate with biometrics",
        variant: "destructive",
      });
    } finally {
      setAuthenticating(false);
    }
  };

  const enrollBiometric = async () => {
    // Implementation for biometric enrollment
    throw new Error("Not implemented");
  };

  return {
    authenticating,
    startBiometricAuth,
    enrollBiometric
  };
};