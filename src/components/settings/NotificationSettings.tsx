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
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Set your preferred notification time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="time"
          value={notificationTime}
          onChange={(e) => setNotificationTime(e.target.value)}
          placeholder="Select Time"
        />
        <Button
          onClick={handleNotificationUpdate}
          disabled={isUpdating}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isUpdating ? "Saving..." : "Save Notification Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};