import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignUpInputs } from "./SignUpInputs";
import { useSignUpValidation } from "./SignUpValidation";
import { useSignUp } from "@/hooks/useSignUp";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

export const SignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { validateInputs } = useSignUpValidation();
  const { isLoading, handleSignUp } = useSignUp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    
    // Check password requirements and show toast
    const requirements = [];
    if (value.length < 8) requirements.push("8+ characters");
    if (!/[A-Z]/.test(value)) requirements.push("uppercase letter");
    if (!/[a-z]/.test(value)) requirements.push("lowercase letter");
    if (!/[0-9]/.test(value)) requirements.push("number");
    if (!/[!@#$%^&*]/.test(value)) requirements.push("special character");
    
    if (requirements.length > 0) {
      toast({
        title: "Password Requirements",
        description: `Password must include: ${requirements.join(", ")}`,
        variant: "default",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs(fullName, email, password, phoneNumber)) {
      return;
    }

    try {
      const success = await handleSignUp(fullName, email, password, phoneNumber);
      
      if (success) {
        toast({
          title: "Success!",
          description: "Please check your email to verify your account. You will be able to set your password after verification.",
          duration: 6000,
        });
        navigate("/signin");
      }
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (authError?.message?.toLowerCase().includes("email already registered")) {
        errorMessage = "This email is already registered. Please use a different email or try signing in.";
      } else if (authError?.message?.toLowerCase().includes("phone number already registered")) {
        errorMessage = "This phone number is already registered. Please use a different number or try signing in.";
      } else if (authError.status === 429) {
        errorMessage = "Please wait a few minutes before trying again for security purposes.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SignUpInputs
        fullName={fullName}
        email={email}
        phoneNumber={phoneNumber}
        password={password}
        setFullName={setFullName}
        setEmail={setEmail}
        setPhoneNumber={setPhoneNumber}
        setPassword={handlePasswordChange}
        isLoading={isLoading}
      />
      
      <p className="text-sm text-gray-600 text-center">
        By clicking Sign Up, you agree to our{" "}
        <Link to="/terms" className="text-[#7F3DFF] hover:text-[#6366F1] transition-colors">
          Terms & Conditions
        </Link>
      </p>
      
      <Button 
        type="submit" 
        className="w-full h-12 rounded-xl text-base bg-[#7F3DFF] hover:bg-[#6366F1] transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>

      <p className="text-center text-gray-600 text-sm">
        Already have an account?{" "}
        <Link to="/signin" className="text-[#7F3DFF] hover:text-[#6366F1] transition-colors">
          Sign In
        </Link>
      </p>
    </form>
  );
};