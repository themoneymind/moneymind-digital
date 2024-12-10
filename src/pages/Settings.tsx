import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProfilePicture } from "@/components/ProfilePicture";
import { Bell, Lock, UserCircle } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notificationTime, setNotificationTime] = useState("09:00");
  const [isUpdating, setIsUpdating] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");

  const handleNotificationUpdate = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ notification_time: notificationTime })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <ProfilePicture />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <Button className="w-full">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Customize when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Daily Reminder Time</label>
                <Input
                  type="time"
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                />
              </div>
              <Button
                onClick={handleNotificationUpdate}
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? "Updating..." : "Save Notification Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // Implement password change logic
                    toast({
                      title: "Coming Soon",
                      description: "Password change feature will be available soon",
                    });
                  }}
                >
                  Change Password
                </Button>
              </div>
              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Privacy & Security Information</h3>
                <p className="text-sm text-gray-500">
                  We take your privacy and security seriously. Your data is encrypted
                  and stored securely. We never share your personal information
                  with third parties without your explicit consent.
                </p>
                <ul className="text-sm text-gray-500 list-disc pl-5 space-y-2">
                  <li>End-to-end encryption for all sensitive data</li>
                  <li>Regular security audits and updates</li>
                  <li>Two-factor authentication support</li>
                  <li>GDPR and CCPA compliant</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;