import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PiggyBank } from "lucide-react";
import { PasswordSignIn } from "./signin/PasswordSignIn";
import { PinSignIn } from "./signin/PinSignIn";
import { BiometricSignIn } from "./signin/BiometricSignIn";
import { SignInTabs } from "./signin/SignInTabs";
import { useSignInForm } from "@/hooks/useSignInForm";

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
  const {
    activeTab,
    setActiveTab,
    biometricAvailable,
    setBiometricAvailable,
    handleBiometricLogin,
    rememberMe,
    setRememberMe,
  } = useSignInForm();

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
  }, [setBiometricAvailable]);

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
        <SignInTabs biometricAvailable={biometricAvailable} />

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

        <TabsContent value="otp" className="mt-6">
          <PinSignIn
            email={email}
            setEmail={setEmail}
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