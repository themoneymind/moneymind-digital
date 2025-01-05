import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, Lock, PiggyBank, Fingerprint, KeyRound } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const SignInForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  isLoading,
}: SignInFormProps) => {
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("rememberMe") === "true";
  });
  const [pin, setPin] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState("password");

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("rememberedEmail");
    }
    handleSubmit(e);
  };

  const handlePinChange = (value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setPin(value);
    }
  };

  const handleBiometricLogin = async () => {
    // Biometric authentication logic will be implemented here
    console.log("Biometric login attempted");
  };

  return (
    <div className="space-y-6">
      <div className="text-left space-y-2">
        <div className="flex items-center mb-2">
          <PiggyBank className="h-10 w-10 text-[#7F3DFF]" />
        </div>
        <h1 className="text-2xl font-bold text-[#7F3DFF]">MoneyMind</h1>
        <p className="text-gray-600 text-base">
          Sign in to your account
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="pin">PIN</TabsTrigger>
          {biometricAvailable && (
            <TabsTrigger value="biometric">Biometric</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="password">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
                <Mail className="h-4 w-4 text-[#7F3DFF]" />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
                  <Lock className="h-4 w-4 text-[#7F3DFF]" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-gray-300"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-gray-600 cursor-pointer"
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
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="pin">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
                <Mail className="h-4 w-4 text-[#7F3DFF]" />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
                disabled={isLoading}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F3FF]">
                <KeyRound className="h-4 w-4 text-[#7F3DFF]" />
              </div>
              <input
                type="password"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF]"
                disabled={isLoading}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In with PIN"}
            </Button>
          </form>
        </TabsContent>

        {biometricAvailable && (
          <TabsContent value="biometric">
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
          </TabsContent>
        )}
      </Tabs>

      <p className="text-gray-600 text-sm text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-[#7F3DFF] hover:text-[#7F3DFF]/90">
          Sign up
        </Link>
      </p>
    </div>
  );
};