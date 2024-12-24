import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { SettingsMenu } from "@/components/settings/SettingsMenu";
import { ProfileHeader } from "@/components/settings/ProfileHeader";
import { DisplaySettings } from "@/components/settings/DisplaySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { AccountSettings } from "@/components/settings/AccountSettings";

const Settings = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string>("display");

  const renderSettingsSection = () => {
    switch (activeSection) {
      case "display":
        return <DisplaySettings />;
      case "notifications":
        return <NotificationSettings />;
      case "security":
        return <SecuritySettings />;
      case "privacy":
        return <PrivacySettings />;
      case "account":
        return <AccountSettings />;
      default:
        return <DisplaySettings />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="max-w-2xl mx-auto p-4 pb-20 space-y-6">
        <ProfileHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <SettingsMenu activeSection={activeSection} onSectionChange={setActiveSection} />
          </div>
          <div className="md:col-span-2">
            {renderSettingsSection()}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;