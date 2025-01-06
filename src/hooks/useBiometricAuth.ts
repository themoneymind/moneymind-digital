import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface BiometricCredentials {
  id: string;
  type: string;
  email: string;
  rawId: number[];
}

export const useBiometricAuth = () => {
  const [authenticating, setAuthenticating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const isBiometricSupported = window.PublicKeyCredential !== undefined;

  const enrollBiometric = async () => {
    if (!isBiometricSupported) {
      throw new Error("Biometric authentication is not supported on this device");
    }

    if (!user?.email) {
      throw new Error("User email not found");
    }

    try {
      const { data: { challenge }, error: challengeError } = await supabase.functions.invoke('get-auth-challenge', {
        body: { type: 'enroll' }
      });

      if (challengeError) throw challengeError;

      const challengeBuffer = Uint8Array.from(atob(challenge), c => c.charCodeAt(0));
      
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challengeBuffer,
          rp: {
            name: "Your App",
            id: window.location.hostname,
          },
          user: {
            id: Uint8Array.from(user.id, c => c.charCodeAt(0)),
            name: user.email,
            displayName: user.email.split('@')[0],
          },
          pubKeyCredParams: [{alg: -7, type: "public-key"}],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
        }
      });

      if (!credential) throw new Error("No credentials received");

      return credential;
    } catch (error) {
      console.error('Biometric enrollment error:', error);
      throw error;
    }
  };

  const startBiometricAuth = async (onSuccess: () => Promise<void>) => {
    if (!isBiometricSupported) {
      toast({
        title: "Error",
        description: "Your device doesn't support biometric authentication",
        variant: "destructive",
      });
      return;
    }

    setAuthenticating(true);

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("biometric_credentials")
        .single();

      if (profileError) throw profileError;

      const biometricCredentials = profileData?.biometric_credentials as BiometricCredentials;
      
      if (!biometricCredentials?.email) {
        throw new Error("Biometric credentials not found. Please set up biometric authentication first.");
      }

      const { data: { challenge }, error: challengeError } = await supabase.functions.invoke('get-auth-challenge', {
        body: { type: 'get' }
      });

      if (challengeError) throw challengeError;

      const challengeBuffer = Uint8Array.from(atob(challenge), c => c.charCodeAt(0));
      
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: challengeBuffer,
          timeout: 60000,
          userVerification: "required",
          rpId: window.location.hostname,
        }
      });

      if (!credential) throw new Error("No credentials received");

      const { error: verifyError } = await supabase.functions.invoke('verify-biometric', {
        body: {
          credential,
          challenge,
          email: biometricCredentials.email
        }
      });

      if (verifyError) throw verifyError;

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
    startBiometricAuth,
    isBiometricSupported,
    enrollBiometric
  };
};