import { Button } from "@/components/ui/button";
import { BiometricIcon } from "./BiometricIcon";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";

interface BiometricSignInProps {
  handleBiometricLogin: () => Promise<void>;
  isLoading: boolean;
}

export const BiometricSignIn = ({
  handleBiometricLogin,
  isLoading,
}: BiometricSignInProps) => {
  const { authenticating, startBiometricAuth } = useBiometricAuth();

  const handleBiometricAuth = () => {
    startBiometricAuth(handleBiometricLogin);
  };

  return (
    <div className="space-y-6">
      <BiometricIcon />
      <Button 
        onClick={handleBiometricAuth}
        className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        disabled={isLoading || authenticating}
      >
        {authenticating ? "Verifying..." : "Sign In with Biometrics"}
      </Button>
    </div>
  );
};