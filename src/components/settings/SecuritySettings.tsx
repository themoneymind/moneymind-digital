import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ResetDataDialog } from "./ResetDataDialog";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleResetPassword = () => {
    navigate("/reset-password");
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
            onClick={handleResetPassword}
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