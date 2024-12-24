import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ResetDataDialog } from "./ResetDataDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Key, Smartphone, History, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SecuritySettings = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
            className="w-full border-gray-200 hover:bg-gray-50 rounded-lg h-11 justify-start"
            onClick={() => navigate("/app/settings/security/password")}
          >
            <Key className="w-4 h-4 mr-2 text-primary" />
            Change Password
          </Button>

          <Button
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-50 rounded-lg h-11 justify-start"
            onClick={() => navigate("/app/settings/security/devices")}
          >
            <Smartphone className="w-4 h-4 mr-2 text-orange-500" />
            Connected Devices
          </Button>

          <Button
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-50 rounded-lg h-11 justify-start"
            onClick={() => navigate("/app/settings/security/activity")}
          >
            <History className="w-4 h-4 mr-2 text-blue-500" />
            Login Activity
          </Button>

          <Button
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-50 rounded-lg h-11 justify-start"
            onClick={() => navigate("/app/settings/security/2fa")}
          >
            <Shield className="w-4 h-4 mr-2 text-green-500" />
            Two-Factor Authentication
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none bg-white rounded-apple">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-red-600">Danger Zone</CardTitle>
          <CardDescription className="text-gray-500">
            Actions here can't be undone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResetDataDialog />
          <Button
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 rounded-lg h-11"
            onClick={() => navigate("/app/settings/security/delete-account")}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};