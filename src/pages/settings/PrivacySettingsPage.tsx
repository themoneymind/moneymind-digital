import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { SettingsHeader } from "@/components/settings/SettingsHeader";

export const PrivacySettingsPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <SettingsHeader title="Privacy" />
      <div className="max-w-2xl mx-auto p-4">
        <PrivacySettings />
      </div>
    </div>
  );
};