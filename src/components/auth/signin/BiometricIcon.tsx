import { Fingerprint } from "lucide-react";

export const BiometricIcon = () => {
  return (
    <div className="text-center">
      <Fingerprint className="h-16 w-16 mx-auto text-[#7F3DFF]" />
      <p className="mt-4 text-gray-600">
        Use your fingerprint or face ID to sign in
      </p>
    </div>
  );
};