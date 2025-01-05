import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

const UPI_APPS = ["GPay", "PhonePe", "Cred", "IppoPay", "Custom UPI"];

type UpiAppsSelectorProps = {
  selectedUpiApps: string[];
  onUpiToggle: (upiApp: string) => void;
  customUpi: string;
  onCustomUpiChange: (value: string) => void;
};

export const UpiAppsSelector = ({
  selectedUpiApps,
  onUpiToggle,
  customUpi,
  onCustomUpiChange,
}: UpiAppsSelectorProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleUpiSelection = (app: string) => {
    if (app === "Custom UPI") {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
    }
    onUpiToggle(app);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-gray-400 mb-4">Selected bank linked UPI</h3>
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
                onClick={() => handleUpiSelection(app)}
              />
              <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {app}
              </span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {showCustomInput && (
        <div className="space-y-2">
          <Input
            value={customUpi}
            onChange={(e) => {
              onCustomUpiChange(e.target.value);
              if (e.target.value) {
                // Add the custom UPI to selectedUpiApps if it's not empty
                if (!selectedUpiApps.includes(e.target.value)) {
                  onUpiToggle(e.target.value);
                }
              }
            }}
            placeholder="Enter your custom UPI name"
            className="h-12 rounded-[12px] text-base"
          />
        </div>
      )}
    </div>
  );
};