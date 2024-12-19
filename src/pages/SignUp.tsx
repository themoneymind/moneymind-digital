import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const SignUp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center justify-center w-10 h-10 mb-8 rounded-full bg-gray-900/80 text-white hover:bg-gray-900/90 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="bg-white rounded-[32px] p-8 shadow-xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Get Started</h1>
              <p className="text-gray-500">
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