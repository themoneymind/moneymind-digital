import { Checkbox } from "@/components/ui/checkbox";

const UPI_APPS = ["GPay", "PhonePe", "Cred", "IppoPay"];

type UpiAppsSelectorProps = {
  selectedUpiApps: string[];
  onUpiToggle: (upiApp: string) => void;
};

export const UpiAppsSelector = ({
  selectedUpiApps,
  onUpiToggle,
}: UpiAppsSelectorProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-base">UPI Apps</h3>
      <div className="grid grid-cols-2 gap-4">
        {UPI_APPS.map((app) => (
          <div
            key={app}
            className="flex items-center space-x-3 bg-white p-4 rounded-[12px] border"
          >
            <Checkbox
              id={app}
              checked={selectedUpiApps.includes(app)}
              onCheckedChange={() => onUpiToggle(app)}
            />
            <label
              htmlFor={app}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {app}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};