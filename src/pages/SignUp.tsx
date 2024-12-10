import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const SignUp = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <Link to="/" className="inline-block mb-8">
        <ArrowLeft className="h-6 w-6" />
      </Link>

      <div className="space-y-6 max-w-md mx-auto">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-primary">MoneyMind</h1>
          <p className="text-xl font-medium text-gray-600">Create your account</p>
        </div>

        <SignUpForm />

        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary font-medium">
              Sign in
            </Link>
          </p>

          <p className="text-center text-sm text-gray-500">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-primary underline hover:text-primary/90">
              Terms and Conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};