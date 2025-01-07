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
  return (
    <div className="space-y-4">
      <UpiAppsSelector
        selectedUpiApps={selectedUpiApps}
        onUpiToggle={onUpiToggle}
        customUpi={customUpi}
        onCustomUpiChange={onCustomUpiChange}
      />
    </div>
  );
};