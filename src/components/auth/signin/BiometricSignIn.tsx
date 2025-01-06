import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";

interface BiometricSignInProps {
  handleBiometricLogin: () => void;
  isLoading: boolean;
}

export const BiometricSignIn = ({
  handleBiometricLogin,
  isLoading,
}: BiometricSignInProps) => {
  return (
    <div className="space-y-6">
      <p className="text-center text-gray-600">
        Use your biometric authentication to sign in
      </p>
      <Button
        onClick={handleBiometricLogin}
        className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        disabled={isLoading}
      >
        <Fingerprint className="mr-2 h-4 w-4" />
        {isLoading ? "Authenticating..." : "Use Biometric"}
      </Button>
    </div>
  );
};