import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PiggyBank } from "lucide-react";
import { TopBar } from "@/components/TopBar";

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
          setCooldownTime(60);
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
      setCooldownTime(60);
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
    <div className="min-h-screen bg-[#F5F3FF] relative overflow-hidden">
      <TopBar title="Forgot Password" />
      
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#7F3DFF]/10 -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[#7F3DFF]/10 -ml-20 -mb-20" />
      
      <div className="p-6 pt-8">
        <div className="space-y-6">
          <div className="text-left space-y-2">
            <div className="flex items-center mb-2">
              <PiggyBank className="h-10 w-10 text-[#7F3DFF]" />
            </div>
            <h1 className="text-2xl font-bold text-[#7F3DFF]">Forgot Password</h1>
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
              className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-gray-900/70 placeholder:text-gray-500/60 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]"
              disabled={isLoading || cooldownTime > 0}
              required
            />
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
              disabled={isLoading || cooldownTime > 0}
            >
              {isLoading ? "Sending Instructions..." : 
               cooldownTime > 0 ? `Wait ${cooldownTime}s` : "Reset Password"}
            </Button>
          </form>

          <p className="text-gray-600 text-sm">
            Remember your password?{" "}
            <Link to="/signin" className="text-[#7F3DFF] hover:text-[#7F3DFF]/90">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};