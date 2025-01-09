import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting password reset process");
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting to update password");
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) throw error;
      
      console.log("Password updated successfully - signing out before navigation");
      
      // Sign out the user after password reset
      await supabase.auth.signOut();
      
      console.log("Successfully signed out - navigating to success page");
      // Navigate to success page with replace to prevent going back
      navigate("/reset-password-success", { replace: true });
      
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="h-12 py-3 bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF] focus:ring-0"
        disabled={isLoading}
        required
      />
      <Input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="h-12 py-3 bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF] focus:ring-0"
        disabled={isLoading}
        required
      />
      <Button 
        type="submit" 
        className="w-full h-12 rounded-xl text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        disabled={isLoading}
      >
        {isLoading ? "Updating Password..." : "Reset Password"}
      </Button>
    </form>
  );
};