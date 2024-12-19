import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
            description: "Wrong login credentials",
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
    <div className="min-h-screen bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to relative overflow-hidden flex items-center justify-center px-6 py-8">
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10 blur-xl" />
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-white/10 blur-xl" />

      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center w-12 h-12 mb-8 rounded-full bg-gray-900/80 text-white hover:bg-gray-900/90 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        <div className="bg-white rounded-[32px] p-8 shadow-xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="text-gray-500">
                Sign in to continue managing your finances
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 px-4 focus:border-primary focus:ring-primary"
                disabled={isLoading}
                required
              />
              <div className="space-y-1">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 rounded-2xl border-gray-200 bg-gray-50/50 px-4 focus:border-primary focus:ring-primary"
                  disabled={isLoading}
                  required
                />
                <div className="flex items-center justify-end text-sm">
                  <Link to="/forgot-password" className="text-primary hover:text-primary/90">
                    Forgot Password?
                  </Link>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl text-base bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:text-primary/90 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
