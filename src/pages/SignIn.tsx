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
    console.log("Attempting to sign in with:", email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Sign in response:", { data, error });

      if (error) {
        let errorMessage = "Invalid email or password. Please try again.";
        
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please confirm your email address before signing in.";
        } else if (error.message.includes("Invalid credentials")) {
          errorMessage = "Invalid email or password. Please try again.";
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (!data.user) {
        toast({
          title: "Error",
          description: "No user found with these credentials",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Successfully signed in",
      });
      
      // AuthContext will handle navigation based on auth state
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
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

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to continue managing your finances
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 rounded-[12px]"
            disabled={isLoading}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 rounded-[12px]"
            disabled={isLoading}
            required
          />
          <Link
            to="/forgot-password"
            className="inline-block text-sm text-primary font-medium"
          >
            Forgot Password?
          </Link>
          <Button 
            type="submit" 
            className="w-full h-14 rounded-[12px] text-base"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};