import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const BiometricNotification = () => {
  const { user } = useAuth();

  const checkAndNotify = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "biometric_feature_announcement")
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking notifications:", error);
        return;
      }

      // If no notification exists, create one
      if (!data) {
        const { error: insertError } = await supabase
          .from("notifications")
          .insert([
            {
              user_id: user.id,
              type: "biometric_feature_announcement",
              message: "Biometric authentication is now available!",
            },
          ]);

        if (insertError) {
          console.error("Error creating notification:", insertError);
        }
      }
    } catch (error) {
      console.error("Error in checkAndNotify:", error);
    }
  };

  useEffect(() => {
    checkAndNotify();
  }, [user]);

  return null;
};