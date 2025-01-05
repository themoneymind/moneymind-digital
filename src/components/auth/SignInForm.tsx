import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PiggyBank } from "lucide-react";
import { PasswordSignIn } from "./signin/PasswordSignIn";
import { PinSignIn } from "./signin/PinSignIn";
import { BiometricSignIn } from "./signin/BiometricSignIn";

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

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="flex p-1 bg-gray-100 rounded-full gap-2">
          <TabsTrigger
            value="password"
            className="flex-1 px-6 py-2 rounded-full text-sm transition-all data-[state=active]:bg-[#7F3DFF] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500"
          >
            Password
          </TabsTrigger>
          <TabsTrigger
            value="pin"
            className="flex-1 px-6 py-2 rounded-full text-sm transition-all data-[state=active]:bg-[#7F3DFF] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500"
          >
            PIN
          </TabsTrigger>
          {biometricAvailable && (
            <TabsTrigger
              value="biometric"
              className="flex-1 px-6 py-2 rounded-full text-sm transition-all data-[state=active]:bg-[#7F3DFF] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500"
            >
              Biometric
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="password" className="mt-6">
          <PasswordSignIn
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            handleSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="pin" className="mt-6">
          <PinSignIn
            email={email}
            setEmail={setEmail}
            pin={pin}
            setPin={setPin}
            handleSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        </TabsContent>

        {biometricAvailable && (
          <TabsContent value="biometric" className="mt-6">
            <BiometricSignIn
              handleBiometricLogin={handleBiometricLogin}
              isLoading={isLoading}
            />
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