import { Input } from "@/components/ui/input";
import { UpiAppsSelector } from "./UpiAppsSelector";

interface PaymentSourceDialogContentProps {
  name: string;
  setName: (name: string) => void;
  selectedUpiApps: string[];
  setSelectedUpiApps: (apps: string[]) => void;
  sourceType?: string;
  customUpi: string;
  onCustomUpiChange: (value: string) => void;
}

export const PaymentSourceDialogContent = ({
  name,
  setName,
  selectedUpiApps,
  setSelectedUpiApps,
  sourceType,
  customUpi,
  onCustomUpiChange,
}: PaymentSourceDialogContentProps) => {
  const handleUpiToggle = (app: string) => {
    const newApps = selectedUpiApps.includes(app)
      ? selectedUpiApps.filter(a => a !== app)
      : [...selectedUpiApps, app];
    setSelectedUpiApps(newApps);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Input
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 rounded-[12px] text-base"
        />
      </div>
      {sourceType === "Bank" && (
        <UpiAppsSelector
          selectedUpiApps={selectedUpiApps}
          onUpiToggle={handleUpiToggle}
          customUpi={customUpi}
          onCustomUpiChange={onCustomUpiChange}
        />
      )}
    </div>
  );
};