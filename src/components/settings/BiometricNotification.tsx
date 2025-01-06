import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const BiometricNotification = () => {
  const { user } = useAuth();

  useEffect(() => {
    const checkAndNotify = async () => {
      if (!user) return;

      try {
        // Check if user has been notified about biometric
        const { data: notifications, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "biometric_feature_announcement")
          .maybeSingle();

        if (error) {
          console.error("Error checking notifications:", error);
          return;
        }

        if (!notifications) {
          // Create notification for the new feature
          const { error: insertError } = await supabase
            .from("notifications")
            .insert({
              user_id: user.id,
              message: "New feature: You can now use biometric authentication (fingerprint/face ID) to login. Enable it in Security Settings!",
              type: "biometric_feature_announcement"
            });

          if (insertError) {
            console.error("Error creating notification:", insertError);
            return;
          }

          // Show toast notification
          toast.info("New: Biometric login is now available! Enable it in Security Settings.");
        }
      } catch (error) {
        console.error("Error in checkAndNotify:", error);
      }
    };

    checkAndNotify();
  }, [user]);

  return null;
};