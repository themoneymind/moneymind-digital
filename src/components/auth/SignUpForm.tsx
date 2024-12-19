import { useState } from "react";
import { Link } from "react-router-dom";
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
    <form onSubmit={handleSubmit} className="space-y-6">
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
      
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="terms" 
          className="rounded border-gray-300 text-primary focus:ring-primary"
          required 
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the processing of{" "}
          <Link to="/terms" className="text-primary hover:text-primary/90">
            Personal data
          </Link>
        </label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 rounded-2xl text-base bg-primary hover:bg-primary/90 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>

      <p className="text-center text-gray-500">
        Already have an account?{" "}
        <Link to="/signin" className="text-primary hover:text-primary/90 font-medium">
          Sign In
        </Link>
      </p>
    </form>
  );
};