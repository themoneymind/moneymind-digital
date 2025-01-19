import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignUpInputs } from "./SignUpInputs";
import { useSignUpValidation } from "./SignUpValidation";
import { useSignUp } from "@/hooks/useSignUp";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";
import { PasswordRequirements } from "./PasswordRequirements";
import { SignUpFooter } from "./SignUpFooter";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";

export const SignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { validateInputs } = useSignUpValidation();
  const { isLoading, handleSignUp } = useSignUp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { showRequirements, validatePassword } = usePasswordValidation();

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
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
      
      <PasswordRequirements password={password} show={showRequirements} />
      
      <Button 
        type="submit" 
        className="w-full h-12 rounded-xl text-base bg-[#7F3DFF] hover:bg-[#6366F1] transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>

      <SignUpFooter />
    </form>
  );
};