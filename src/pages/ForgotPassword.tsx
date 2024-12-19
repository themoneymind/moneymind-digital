import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PiggyBank } from "lucide-react";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(time => time - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cooldownTime > 0) {
      toast({
        title: "Please wait",
        description: `You can request another reset email in ${cooldownTime} seconds`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        if (error.message.includes('rate_limit')) {
          setCooldownTime(60); // 60 seconds cooldown
          toast({
            title: "Too many attempts",
            description: "Please wait a minute before trying again",
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

      toast({
        title: "Success",
        description: "Password reset instructions have been sent to your email",
      });
      
      setEmail("");
      setCooldownTime(60); // Set cooldown after successful request
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
    <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-[400px]">
        <div className="bg-white rounded-[32px] p-8 shadow-lg">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-2">
                <PiggyBank className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-blue-600">Forgot Password</h1>
              <p className="text-gray-600 text-base">
                Enter your email to reset your password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-gray-900/70 placeholder:text-gray-500/60 focus:border-blue-600 focus:ring-blue-600"
                disabled={isLoading || cooldownTime > 0}
                required
              />
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-base bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || cooldownTime > 0}
              >
                {isLoading ? "Sending Instructions..." : 
                 cooldownTime > 0 ? `Wait ${cooldownTime}s` : "Reset Password"}
              </Button>
            </form>

            <p className="text-center text-gray-600 text-sm">
              Remember your password?{" "}
              <Link to="/signin" className="text-blue-600 hover:text-blue-700">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};