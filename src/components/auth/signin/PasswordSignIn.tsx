import { Link } from "react-router-dom";
import { Mail, Lock, Fingerprint, Scan } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

interface PasswordSignInProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (checked: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const PasswordSignIn = ({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  handleSubmit,
  isLoading,
}: PasswordSignInProps) => {
  const [isFaceIdAvailable, setIsFaceIdAvailable] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    const checkBiometricAvailability = async () => {
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricAvailable(available);
          // On Apple devices, we assume FaceID is available if platform authenticator is available
          setIsFaceIdAvailable(available && /iPhone|iPad|iPod|Mac/.test(navigator.userAgent));
        } catch (error) {
          console.error('Error checking biometric availability:', error);
          setBiometricAvailable(false);
          setIsFaceIdAvailable(false);
        }
      }
    };

    checkBiometricAvailability();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Mail className="h-4 w-4 text-[#7F3DFF]" />
          </div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF] focus:ring-0"
            disabled={isLoading}
            required
          />
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Lock className="h-4 w-4 text-[#7F3DFF]" />
          </div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF] focus:ring-0"
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="border-2 border-gray-300 data-[state=checked]:bg-[#7F3DFF] data-[state=checked]:border-[#7F3DFF]"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>

        <Link
          to="/forgot-password"
          className="text-sm text-[#7F3DFF] hover:text-[#7F3DFF]/90"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          className="w-[70%] h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        {biometricAvailable && (
          <Button
            type="button"
            onClick={() => {
              const event = new CustomEvent('biometric-login');
              window.dispatchEvent(event);
            }}
            className="w-[30%] h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90 flex items-center justify-center"
            disabled={isLoading}
          >
            {isFaceIdAvailable ? (
              <Scan className="h-6 w-6" />
            ) : (
              <Fingerprint className="h-6 w-6" />
            )}
          </Button>
        )}
      </div>
    </form>
  );
};