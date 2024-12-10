import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SignUpInputs } from "./SignUpInputs";
import { PasswordRequirements } from "./PasswordRequirements";
import { useSignUpValidation } from "./SignUpValidation";

export const SignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { validateInputs } = useSignUpValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs(fullName, email, password, phoneNumber)) {
      return;
    }

    setIsLoading(true);

    try {
      const [firstName, ...lastNameParts] = fullName.trim().split(" ");
      const lastName = lastNameParts.join(" ");

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName || null,
            phone_number: phoneNumber,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        
        // Check if the error is a rate limit error
        try {
          const errorBody = error.message && JSON.parse(error.message);
          if (error.status === 429 || (errorBody && errorBody.code === "over_email_send_rate_limit")) {
            toast({
              title: "Too Many Attempts",
              description: "Please wait a few minutes before trying to sign up again.",
              variant: "destructive",
            });
            return;
          }
        } catch (parseError) {
          // If error message isn't JSON, handle it normally
          console.error("Error parsing error message:", parseError);
        }
        
        // Handle other types of errors
        if (error.message.includes('sending confirmation email')) {
          console.error("Email confirmation error:", error);
          toast({
            title: "Account Created",
            description: "Your account was created, but there was an issue sending the confirmation email. Please try signing in.",
          });
          navigate("/signin");
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      localStorage.setItem("isFirstTimeUser", "true");
      
      toast({
        title: "Success",
        description: "Account created successfully. Please check your email to verify your account.",
      });
      
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
      
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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