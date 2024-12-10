import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SignUp = () => {
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
        if (error.message.includes('sending confirmation email')) {
          console.error("Email confirmation error:", error);
          // Still allow signup but inform user about email issue
          toast({
            title: "Account Created",
            description: "Your account was created, but there was an issue sending the confirmation email. You can still proceed to login.",
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
      
      // Don't navigate here - let the ProtectedRoute handle navigation
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
    <div className="min-h-screen bg-background p-6">
      <Link to="/" className="inline-block mb-8">
        <ArrowLeft className="h-6 w-6" />
      </Link>

      <div className="space-y-6 max-w-md mx-auto">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-primary">MoneyMind</h1>
          <p className="text-xl font-medium text-gray-600">Create your account</p>
        </div>

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