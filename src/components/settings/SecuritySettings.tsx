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
import { LogOut } from "lucide-react";

export const SecuritySettings = () => {
  const { signOut } = useAuth();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
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