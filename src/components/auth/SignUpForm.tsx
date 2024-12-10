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

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName || null,
            phone_number: phoneNumber,
          },
          emailRedirectTo: `${window.location.origin}/signin`,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        
        // Handle rate limit errors
        if (error.status === 429) {
          toast({
            title: "Please wait",
            description: "Too many signup attempts. Please try again in a few minutes.",
            variant: "destructive",
          });
          return;
        }

        // Handle other errors
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data?.user) {
        localStorage.setItem("isFirstTimeUser", "true");
        
        toast({
          title: "Success!",
          description: "Please check your email to verify your account. Then you can sign in.",
        });
        
        // Give user time to read the success message
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      }
      
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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