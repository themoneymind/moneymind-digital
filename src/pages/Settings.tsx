import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { SettingsMenu } from "@/components/settings/SettingsMenu";
import { ProfileHeader } from "@/components/settings/ProfileHeader";

const Settings = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        console.log("Profile fetched successfully");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="max-w-2xl mx-auto p-4 pb-20 space-y-6">
        <ProfileHeader />
        <SettingsMenu />
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;