import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  getAuthenticatedUserId, 
  verifyBiometricCredentials,
  getAuthChallenge,
  verifyBiometricAssertion
} from "@/utils/biometricOperations";

export const useBiometricAuth = () => {
  const [authenticating, setAuthenticating] = useState(false);

  const handleBiometricAuth = async () => {
    if (!window.PublicKeyCredential) {
      toast.error("Biometric authentication is not supported on this device");
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
      const options = {
        challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
        allowCredentials: [{
          id: Uint8Array.from(atob(biometricCredentials.credentialId), c => c.charCodeAt(0)),
          type: 'public-key',
          transports: ['internal']
        }],
        timeout: 60000,
        userVerification: "required" as UserVerificationRequirement,
        rpId: window.location.hostname,
      };

      // Get credential
      const credential = await navigator.credentials.get({
        publicKey: options
      });

      if (!credential) {
        throw new Error("No credential received");
      }

      // Verify the assertion
      await verifyBiometricAssertion(
        credential,
        challenge,
        biometricCredentials.email
      );

      // Sign in with email
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: biometricCredentials.email,
        password: biometricCredentials.password,
      });

      if (signInError) throw signInError;

      toast.success("Successfully authenticated with biometrics");
    } catch (error: any) {
      console.error("Biometric authentication error:", error);
      toast.error(error.message || "Biometric authentication failed");
    } finally {
      setAuthenticating(false);
    }
  };

  return {
    handleBiometricAuth,
    authenticating
  };
};