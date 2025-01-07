import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SettingsHeader } from "@/components/settings/SettingsHeader";

export const NotificationSettingsPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <SettingsHeader title="Notifications" />
      <div className="max-w-2xl mx-auto p-4">
        <NotificationSettings />
      </div>
    </div>
  );
};