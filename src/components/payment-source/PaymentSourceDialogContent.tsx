import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpiAppsSelector } from "./UpiAppsSelector";

interface PaymentSourceDialogContentProps {
  name: string;
  setName: (name: string) => void;
  selectedUpiApps: string[];
  setSelectedUpiApps: (apps: string[]) => void;
  sourceType?: string;
  onSave: () => void;
  onDelete?: () => void;
  isSubmitting: boolean;
  customUpi: string;
  onCustomUpiChange: (value: string) => void;
}

export const PaymentSourceDialogContent = ({
  name,
  setName,
  selectedUpiApps,
  setSelectedUpiApps,
  sourceType,
  onSave,
  onDelete,
  isSubmitting,
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
    <div className="space-y-4">
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
      <div className="flex gap-2">
        <Button 
          onClick={onSave} 
          className="flex-1 h-12 rounded-[12px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        {onDelete && (
          <Button 
            onClick={onDelete}
            variant="destructive"
            className="flex-1 h-12 rounded-[12px] bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};