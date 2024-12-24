import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { SettingsHeader } from "@/components/settings/SettingsHeader";

export const SecuritySettingsPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <SettingsHeader title="Security" />
      <div className="max-w-2xl mx-auto p-4">
        <SecuritySettings />
      </div>
    </div>
  );
};