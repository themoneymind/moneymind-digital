import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useBiometricAuth = () => {
  const [authenticating, setAuthenticating] = useState(false);
  const { toast } = useToast();

  const verifyBiometricSupport = () => {
    if (!window.PublicKeyCredential) {
      toast({
        title: "Error",
        description: "Your device doesn't support biometric authentication",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const getAuthChallenge = async () => {
    const { data: { challenge }, error: challengeError } = await supabase.functions.invoke('get-auth-challenge', {
      body: { type: 'get' }
    });

    if (challengeError) throw challengeError;
    return challenge;
  };

  const createCredentialRequest = (challenge: string) => {
    const challengeBuffer = Uint8Array.from(atob(challenge), c => c.charCodeAt(0));

    const options: CredentialRequestOptions = {
      publicKey: {
        challenge: challengeBuffer,
        timeout: 60000,
        userVerification: "required" as UserVerificationRequirement,
        rpId: window.location.hostname,
      }
    };

    return options;
  };

  const verifyCredential = async (credential: Credential, challenge: string) => {
    const { error: verifyError } = await supabase.functions.invoke('verify-biometric', {
      body: {
        credential,
        challenge
      }
    });

    if (verifyError) throw verifyError;
  };

  const startBiometricAuth = async (onSuccess: () => Promise<void>) => {
    if (!verifyBiometricSupport()) return;

    setAuthenticating(true);

    try {
      const challenge = await getAuthChallenge();
      const options = createCredentialRequest(challenge);
      const credential = await navigator.credentials.get(options);
      
      if (!credential) throw new Error("No credentials received");

      await verifyCredential(credential, challenge);
      await onSuccess();

      toast({
        title: "Success",
        description: "Biometric authentication successful",
      });

    } catch (error: any) {
      console.error('Biometric auth error:', error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate using biometrics",
        variant: "destructive",
      });
    } finally {
      setAuthenticating(false);
    }
  };

  return {
    authenticating,
    startBiometricAuth
  };
};