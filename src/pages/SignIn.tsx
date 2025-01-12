import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignInDecoration } from "@/components/auth/SignInDecoration";
import { useSessionCheck } from "@/hooks/useSessionCheck";
import { useSignInHandler } from "@/hooks/useSignInHandler";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { checkSession } = useSessionCheck();
  const { handleSignIn, isLoading } = useSignInHandler();

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(email, password);
  };

  return (
    <div className="min-h-screen bg-[#F5F3FF] relative overflow-hidden">
      <TopBar title="Sign In" />
      
      {/* Decorative Circle */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#7F3DFF]/10 -mr-16 -mt-16" />
      
      <div className="p-6 pt-8 md:flex md:items-center md:justify-center md:min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-6xl mx-auto">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            {/* Left Column - Sign In Form */}
            <div className="md:bg-white/50 md:backdrop-blur-sm md:p-8 md:rounded-2xl md:shadow-lg">
              <SignInForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column - Decorative Area */}
            <div className="hidden md:block">
              <SignInDecoration />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};