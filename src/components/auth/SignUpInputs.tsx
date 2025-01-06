import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Lock, Fingerprint } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

interface SignUpInputsProps {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  setFullName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  setPassword: (value: string) => void;
  isLoading: boolean;
}

export const SignUpInputs = ({
  fullName,
  email,
  phoneNumber,
  password,
  setFullName,
  setEmail,
  setPhoneNumber,
  setPassword,
  isLoading,
}: SignUpInputsProps) => {
  const [enableBiometric, setEnableBiometric] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    // Check if WebAuthn is available
    const checkBiometricAvailability = async () => {
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricAvailable(available);
        } catch (error) {
          console.error('Error checking biometric availability:', error);
          setBiometricAvailable(false);
        }
      }
    };

    checkBiometricAvailability();
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
          <User className="h-4 w-4 text-[#7F3DFF]" />
        </div>
        <input
          type="text"
          placeholder="Enter your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full py-3 pl-10 text-sm bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
          disabled={isLoading}
          required
        />
      </div>

      <div className="relative">
        <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
          <Mail className="h-4 w-4 text-[#7F3DFF]" />
        </div>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full py-3 pl-10 text-sm bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
          disabled={isLoading}
          required
        />
      </div>

      <div className="relative">
        <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
          <Phone className="h-4 w-4 text-[#7F3DFF]" />
        </div>
        <input
          type="tel"
          placeholder="Enter your mobile number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full py-3 pl-10 text-sm bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
          disabled={isLoading}
          required
        />
      </div>

      <div className="relative">
        <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
          <Lock className="h-4 w-4 text-[#7F3DFF]" />
        </div>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full py-3 pl-10 text-sm bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
          disabled={isLoading}
          required
        />
      </div>

      {biometricAvailable && (
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <Fingerprint className="h-5 w-5 text-[#7F3DFF]" />
            <span className="text-sm text-gray-600">Enable biometric login</span>
          </div>
          <Switch
            checked={enableBiometric}
            onCheckedChange={setEnableBiometric}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
};