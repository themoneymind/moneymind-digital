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
      console.log("Starting sign in process...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Sign in response:", { data, error });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Error",
            description: "Please confirm your email before signing in",
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

      if (!data.user) {
        toast({
          title: "Error",
          description: "Wrong login credentials",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Successfully signed in",
      });
      
    } catch (error) {
      console.error("Sign in error:", error);
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

        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium">
              Sign Up
            </Link>
          </p>
          
          <p className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-primary underline hover:text-primary/90">
              Terms and Conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};