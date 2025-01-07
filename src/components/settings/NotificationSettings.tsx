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

export const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [notificationTime, setNotificationTime] = useState("09:00");

  const handleNotificationUpdate = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          notification_time: notificationTime,
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      });
    } catch (error) {
      console.error("Error updating notification settings:", error);
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
    <Card className="border-none shadow-none bg-white rounded-apple">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Notification Settings</CardTitle>
        <CardDescription className="text-gray-500">
          Set your preferred notification time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-500 font-medium">Daily Notification Time</label>
          <Input
            type="time"
            value={notificationTime}
            onChange={(e) => setNotificationTime(e.target.value)}
            className="border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
        <Button
          onClick={handleNotificationUpdate}
          disabled={isUpdating}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-11"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};