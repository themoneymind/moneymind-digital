import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignUpInputs } from "./SignUpInputs";
import { PasswordRequirements } from "./PasswordRequirements";
import { useSignUpValidation } from "./SignUpValidation";
import { useSignUp } from "@/hooks/useSignUp";

export const SignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { validateInputs } = useSignUpValidation();
  const { isLoading, handleSignUp } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs(fullName, email, password, phoneNumber)) {
      return;
    }

    await handleSignUp(fullName, email, password, phoneNumber);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SignUpInputs
        fullName={fullName}
        email={email}
        phoneNumber={phoneNumber}
        password={password}
        setFullName={setFullName}
        setEmail={setEmail}
        setPhoneNumber={setPhoneNumber}
        setPassword={setPassword}
        isLoading={isLoading}
      />
      <PasswordRequirements password={password} />
      <Button 
        type="submit" 
        className="w-full h-14 rounded-[12px] text-base bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  );
};