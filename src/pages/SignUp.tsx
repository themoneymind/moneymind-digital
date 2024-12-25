import { SignUpForm } from "@/components/auth/SignUpForm";
import { PiggyBank } from "lucide-react";
import { TopBar } from "@/components/TopBar";

export const SignUp = () => {
  return (
    <div className="min-h-screen bg-[#F5F3FF]">
      <TopBar title="Sign Up" />
      <div className="flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[400px]">
          <div className="bg-white rounded-[32px] p-8 shadow-lg">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center mb-2">
                  <PiggyBank className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-primary">MoneyMind</h1>
                <p className="text-gray-600 text-base">
                  Create your account to start managing your finances
                </p>
              </div>

              <SignUpForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};