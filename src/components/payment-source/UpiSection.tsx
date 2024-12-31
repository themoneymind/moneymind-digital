import { Input } from "@/components/ui/input";
import { UpiAppsSelector } from "./UpiAppsSelector";

interface UpiSectionProps {
  selectedBank: string;
  customUpi: string;
  selectedUpiApps: string[];
  onUpiToggle: (upiApp: string) => void;
  onCustomUpiChange: (value: string) => void;
}

export const UpiSection = ({
  selectedBank,
  customUpi,
  selectedUpiApps,
  onUpiToggle,
  onCustomUpiChange,
}: UpiSectionProps) => {
  const handleCustomUpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCustomUpiChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <UpiAppsSelector
        selectedUpiApps={selectedUpiApps}
        onUpiToggle={onUpiToggle}
      />

      <div className="space-y-2">
        <h3 className="font-medium">Add Custom UPI App</h3>
        <Input
          placeholder="Enter UPI app name"
          value={customUpi}
          onChange={handleCustomUpiChange}
          className="h-14 rounded-[12px] bg-white"
        />
      </div>
    </div>
  );
};