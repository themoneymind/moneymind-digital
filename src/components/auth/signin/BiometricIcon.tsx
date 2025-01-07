import { Fingerprint, Scan } from "lucide-react";
import { useState, useEffect } from "react";

export const BiometricIcon = () => {
  const [isFaceIdAvailable, setIsFaceIdAvailable] = useState(false);

  useEffect(() => {
    // Check if FaceID is available (this is a basic check, can be enhanced)
    const checkFaceIdAvailability = async () => {
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          // On Apple devices, we assume FaceID is available if platform authenticator is available
          // This is a simplified check, you might want to enhance it based on your needs
          setIsFaceIdAvailable(available && /iPhone|iPad|iPod|Mac/.test(navigator.userAgent));
        } catch (error) {
          console.error('Error checking FaceID availability:', error);
          setIsFaceIdAvailable(false);
        }
      }
    };

    checkFaceIdAvailability();
  }, []);

  return (
    <div className="text-center space-y-6">
      <div className="relative inline-block">
        {isFaceIdAvailable ? (
          <Scan className="h-16 w-16 text-[#7F3DFF] animate-pulse" />
        ) : (
          <Fingerprint className="h-16 w-16 text-[#7F3DFF] animate-pulse" />
        )}
        <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-[#7F3DFF]/10 rounded-full flex items-center justify-center">
          <div className="h-4 w-4 bg-[#7F3DFF] rounded-full animate-ping" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {isFaceIdAvailable ? "Face ID" : "Touch ID"}
        </h3>
        <p className="text-sm text-gray-600">
          {isFaceIdAvailable
            ? "Use Face ID to sign in securely"
            : "Use your fingerprint to sign in securely"}
        </p>
      </div>
    </div>
  );
};