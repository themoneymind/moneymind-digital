import { DisplaySettings } from "@/components/settings/DisplaySettings";
import { SettingsHeader } from "@/components/settings/SettingsHeader";

export const DisplaySettingsPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <SettingsHeader title="Display" />
      <div className="max-w-2xl mx-auto p-4">
        <DisplaySettings />
      </div>
    </div>
  );
};