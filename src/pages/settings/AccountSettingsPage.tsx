import { AccountSettings } from "@/components/settings/AccountSettings";
import { SettingsHeader } from "@/components/settings/SettingsHeader";

export const AccountSettingsPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <SettingsHeader title="Account Settings" />
      <div className="max-w-2xl mx-auto p-4">
        <AccountSettings />
      </div>
    </div>
  );
};