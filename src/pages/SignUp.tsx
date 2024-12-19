import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const SignUp = () => {
  return (
    <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-[400px]">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center w-12 h-12 mb-8 rounded-full bg-gray-900/80 text-white hover:bg-gray-900/90 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <div className="bg-white rounded-[32px] p-8 shadow-lg">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-2">
                <img 
                  src="/lovable-uploads/e9fc4495-d8ba-4dcb-82a4-48a4e9bb6d1c.png" 
                  alt="MoneyMind Logo" 
                  className="h-10 w-10"
                />
              </div>
              <h1 className="text-2xl font-bold text-blue-600">MoneyMind</h1>
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