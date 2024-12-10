import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !phoneNumber) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    // Password requirements validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast({
        title: "Error",
        description: "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Split full name into first and last name
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
        
        if (error.status === 429) {
          toast({
            title: "Too Many Attempts",
            description: "Please wait a few minutes before trying again",
            variant: "destructive",
          });
          return;
        }
        
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
      
      // Add a delay before redirecting
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Enter your name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="h-14 rounded-[12px] bg-gray-50"
        disabled={isLoading}
        required
      />
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-14 rounded-[12px] bg-gray-50"
        disabled={isLoading}
        required
      />
      <Input
        type="tel"
        placeholder="Enter your mobile number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="h-14 rounded-[12px] bg-gray-50"
        disabled={isLoading}
        required
      />
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-14 rounded-[12px] bg-gray-50"
          disabled={isLoading}
          required
        />
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Requirements:</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span className={password.length >= 8 ? "text-green-500" : ""}>✓</span>
              8+ characters
            </div>
            <div className="flex items-center gap-1">
              <span className={/[A-Z]/.test(password) ? "text-green-500" : ""}>✓</span>
              1 uppercase
            </div>
            <div className="flex items-center gap-1">
              <span className={/[a-z]/.test(password) ? "text-green-500" : ""}>✓</span>
              1 lowercase
            </div>
            <div className="flex items-center gap-1">
              <span className={/[0-9]/.test(password) ? "text-green-500" : ""}>✓</span>
              1 number
            </div>
            <div className="flex items-center gap-1">
              <span className={/[!@#$%^&*]/.test(password) ? "text-green-500" : ""}>✓</span>
              1 special char
            </div>
          </div>
        </div>
      </div>
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