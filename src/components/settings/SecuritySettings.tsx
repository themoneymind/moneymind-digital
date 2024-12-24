import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ResetDataDialog } from "./ResetDataDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeyRound } from "lucide-react";

export const SecuritySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleForgotPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || "", {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link",
      });
    } catch (error) {
      console.error("Error sending reset password email:", error);
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-white rounded-apple">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Account Security</CardTitle>
          <CardDescription className="text-gray-500">
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-50 rounded-lg h-11"
            onClick={handleForgotPassword}
          >
            <KeyRound className="w-4 h-4 mr-2" />
            Reset Password
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none bg-white rounded-apple">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold text-red-600">Danger Zone</CardTitle>
          <CardDescription className="text-gray-500 mt-1">
            Actions here can't be undone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetDataDialog />
        </CardContent>
      </Card>
    </div>
  );
};