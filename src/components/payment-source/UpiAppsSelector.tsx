import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

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
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-base">UPI Apps</h3>
        <RadioGroup className="grid grid-cols-2 gap-4">
          {UPI_APPS.map((app) => (
            <div
              key={app}
              className="flex items-center space-x-3 bg-white p-4 rounded-[12px] border"
            >
              <RadioGroupItem
                id={app}
                value={app}
                checked={selectedUpiApps.includes(app)}
                onClick={() => onUpiToggle(app)}
              />
              <label
                htmlFor={app}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {app}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-base">Add Custom UPI App</h3>
        <Input
          placeholder="Enter UPI app name"
          className="h-12 rounded-[12px] text-base"
        />
      </div>
    </div>
  );
};