import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PiggyBank } from "lucide-react";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Password has been updated successfully",
      });
      
      // Navigate back to settings after successful password change
      setTimeout(() => {
        navigate("/app/settings/security");
      }, 2000);
      
    } catch (error: any) {
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
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-2">
                <PiggyBank className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-blue-600">Change Password</h1>
              <p className="text-gray-600 text-base">
                Enter your new password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-gray-900/70 placeholder:text-gray-500/60 focus:border-blue-600 focus:ring-blue-600"
                disabled={isLoading}
                required
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-gray-900/70 placeholder:text-gray-500/60 focus:border-blue-600 focus:ring-blue-600"
                disabled={isLoading}
                required
              />
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-base bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};