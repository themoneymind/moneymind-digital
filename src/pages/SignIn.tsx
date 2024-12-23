import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PiggyBank } from "lucide-react";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Starting sign in process with email:", email.trim());
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
        options: {
          redirectTo: 'https://www.themoneymind.in/app'
        }
      });

      console.log("Sign in response:", { data, error });

      if (error) {
        console.error("Sign in error details:", error);
        
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Error",
            description: "Please confirm your email before signing in",
            variant: "destructive",
          });
        } else if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Error",
            description: "Invalid email or password",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      if (!data?.user) {
        console.error("No user data received");
        toast({
          title: "Error",
          description: "Unable to sign in. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Sign in successful:", data.user);
      toast({
        title: "Success",
        description: "Successfully signed in",
      });
      
      navigate("/app");
      
    } catch (error) {
      console.error("Unexpected sign in error:", error);
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
    <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-[400px]">
        <div className="bg-white rounded-[32px] p-8 shadow-lg">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-2">
                <PiggyBank className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-blue-600">MoneyMind</h1>
              <p className="text-gray-600 text-base">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-gray-900/70 placeholder:text-gray-500/60 focus:border-blue-600 focus:ring-blue-600"
                disabled={isLoading}
                required
              />
              <div className="space-y-1">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-gray-900/70 placeholder:text-gray-500/60 focus:border-blue-600 focus:ring-blue-600"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-base bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>

            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};