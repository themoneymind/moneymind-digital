import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BottomNav } from "@/components/BottomNav";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { DisplaySettings } from "@/components/settings/DisplaySettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { AdvancedSecuritySettings } from "@/components/settings/AdvancedSecuritySettings";

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
      <SettingsHeader />

      <div className="max-w-2xl mx-auto p-4 pb-20 space-y-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="w-full bg-transparent border-b border-gray-200 p-0 h-auto">
            <div className="flex space-x-8 overflow-x-auto pb-2">
              <TabsTrigger 
                value="profile"
                className="px-1 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent whitespace-nowrap"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="account"
                className="px-1 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent whitespace-nowrap"
              >
                Account
              </TabsTrigger>
              <TabsTrigger 
                value="display"
                className="px-1 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent whitespace-nowrap"
              >
                Display
              </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className="px-1 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent whitespace-nowrap"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="privacy"
                className="px-1 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent whitespace-nowrap"
              >
                Privacy
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="px-1 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent whitespace-nowrap"
              >
                Security
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="profile" className="mt-6 space-y-6">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="account" className="mt-6 space-y-6">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="display" className="mt-6 space-y-6">
            <DisplaySettings />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 space-y-6">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="privacy" className="mt-6 space-y-6">
            <PrivacySettings />
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <SecuritySettings />
            <AdvancedSecuritySettings />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;