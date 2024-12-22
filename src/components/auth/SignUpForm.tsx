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
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          required 
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the{" "}
          <Link to="/terms" className="text-blue-600 hover:text-blue-700">
            Terms & Conditions
          </Link>
        </label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 rounded-xl text-base bg-blue-600 hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>

      <p className="text-center text-gray-600 text-sm">
        Already have an account?{" "}
        <Link to="/signin" className="text-blue-600 hover:text-blue-700">
          Sign In
        </Link>
      </p>
    </form>
  );
};