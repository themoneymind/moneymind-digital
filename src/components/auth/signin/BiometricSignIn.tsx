import { Button } from "@/components/ui/button";
import { BiometricIcon } from "./BiometricIcon";
import { useBiometricAuth } from "@/hooks/useBiometricAuth";
import { useNavigate } from "react-router-dom";

interface BiometricSignInProps {
  handleBiometricLogin: () => Promise<void>;
  isLoading: boolean;
}

export const BiometricSignIn = ({
  handleBiometricLogin,
  isLoading,
}: BiometricSignInProps) => {
  const { authenticating, startBiometricAuth } = useBiometricAuth();
  const navigate = useNavigate();

  const handleBiometricAuth = () => {
    startBiometricAuth(() => {
      navigate("/app");
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <BiometricIcon />
      </div>
      <Button 
        onClick={handleBiometricAuth}
        className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90 transition-all duration-200 relative overflow-hidden"
        disabled={isLoading || authenticating}
      >
        <span className={`flex items-center justify-center gap-2 ${authenticating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
          Sign In with Biometrics
        </span>
        {authenticating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </Button>
    </div>
  );
};