import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BiometricSignInProps {
  handleBiometricLogin: () => Promise<void>;
  isLoading: boolean;
}

export const BiometricSignIn = ({
  handleBiometricLogin,
  isLoading,
}: BiometricSignInProps) => {
  const [authenticating, setAuthenticating] = useState(false);
  const { toast } = useToast();

  const startBiometricAuth = async () => {
    if (!window.PublicKeyCredential) {
      toast({
        title: "Error",
        description: "Your device doesn't support biometric authentication",
        variant: "destructive",
      });
      return;
    }

    setAuthenticating(true);

    try {
      // Get the challenge from the server
      const { data: { challenge }, error: challengeError } = await supabase.functions.invoke('get-auth-challenge', {
        body: { type: 'get' }
      });

      if (challengeError) throw challengeError;

      // Convert base64 challenge to ArrayBuffer
      const challengeBuffer = Uint8Array.from(atob(challenge), c => c.charCodeAt(0));

      // Create the credential options
      const options = {
        publicKey: {
          challenge: challengeBuffer,
          timeout: 60000,
          userVerification: "required",
          rpId: window.location.hostname,
        }
      };

      // Request biometric verification
      const credential = await navigator.credentials.get(options);
      
      if (!credential) throw new Error("No credentials received");

      // Verify the credential with the server
      const { error: verifyError } = await supabase.functions.invoke('verify-biometric', {
        body: {
          credential,
          challenge
        }
      });

      if (verifyError) throw verifyError;

      // If verification successful, proceed with sign in
      await handleBiometricLogin();

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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Fingerprint className="h-16 w-16 mx-auto text-[#7F3DFF]" />
        <p className="mt-4 text-gray-600">
          Use your fingerprint or face ID to sign in
        </p>
      </div>

      <Button 
        onClick={startBiometricAuth}
        className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        disabled={isLoading || authenticating}
      >
        {authenticating ? "Verifying..." : "Sign In with Biometrics"}
      </Button>
    </div>
  );
};