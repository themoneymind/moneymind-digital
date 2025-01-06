import { Switch } from "@/components/ui/switch";
import { Fingerprint } from "lucide-react";
import { useBiometricSettings } from "@/hooks/useBiometricSettings";

export const BiometricSettings = () => {
  const { biometricEnabled, handleBiometricToggle } = useBiometricSettings();

  return (
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
  );
};