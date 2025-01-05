import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";

interface BiometricSignInProps {
  handleBiometricLogin: () => Promise<void>;
  isLoading: boolean;
}

export const BiometricSignIn = ({
  handleBiometricLogin,
  isLoading,
}: BiometricSignInProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Fingerprint className="h-16 w-16 mx-auto text-[#7F3DFF]" />
        <p className="mt-4 text-gray-600">
          Use your fingerprint or face ID to sign in
        </p>
      </div>

      <Button 
        onClick={handleBiometricLogin}
        className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Sign In with Biometrics"}
      </Button>
    </div>
  );
};