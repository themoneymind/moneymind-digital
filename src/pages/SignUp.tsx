import { SignUpForm } from "@/components/auth/SignUpForm";
import { PiggyBank } from "lucide-react";
import { TopBar } from "@/components/TopBar";

export const SignUp = () => {
  return (
    <div className="min-h-screen bg-[#F5F3FF] relative overflow-hidden">
      <TopBar title="Sign Up" />
      
      {/* Decorative Circle */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#7F3DFF]/10 -mr-16 -mt-16" />
      
      <div className="p-6 pt-8 md:flex md:items-center md:justify-center md:min-h-[calc(100vh-64px)]">
        <div className="md:max-w-md w-full md:shadow-lg md:rounded-2xl md:p-8 md:bg-white/50 md:backdrop-blur-sm">
          <div className="space-y-6">
            <div className="text-left space-y-2">
              <div className="flex items-center mb-2">
                <PiggyBank className="h-10 w-10 text-[#7F3DFF]" />
              </div>
              <h1 className="text-2xl font-bold text-[#7F3DFF]">MoneyMind</h1>
              <p className="text-gray-600 text-base">
                Create your account to start managing your finances
              </p>
            </div>

            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
};