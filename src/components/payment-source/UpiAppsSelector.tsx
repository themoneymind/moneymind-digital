import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
            <label
              key={app}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <RadioGroupItem
                id={app}
                value={app}
                checked={selectedUpiApps.includes(app)}
                onClick={() => onUpiToggle(app)}
              />
              <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {app}
              </span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <input
        placeholder="Enter UPI app name"
        className="w-full py-3 px-0 text-sm bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-primary"
      />
    </div>
  );
};