import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const DEFAULT_UPI_APPS = ["GPay", "PhonePe", "Cred", "IppoPay"];

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
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleUpiSelection = (app: string) => {
    if (app === "custom") {
      setIsCustomMode(!isCustomMode);
      // Clear any previous custom UPI when toggling custom mode off
      if (isCustomMode && customUpi) {
        onUpiToggle(customUpi);
        onCustomUpiChange("");
      }
    } else {
      onUpiToggle(app);
    }
  };

  const handleCustomUpiChange = (value: string) => {
    // Remove any previous custom UPI value
    if (customUpi) {
      onUpiToggle(customUpi);
    }
    onCustomUpiChange(value);
    if (value.trim()) {
      onUpiToggle(value.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-sm text-gray-400 mb-4">Selected bank linked UPI</h3>
        <div className="grid grid-cols-2 gap-4">
          {DEFAULT_UPI_APPS.map((app) => (
            <label
              key={app}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <Checkbox
                id={app}
                checked={selectedUpiApps.includes(app)}
                onCheckedChange={() => handleUpiSelection(app)}
              />
              <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {app}
              </span>
            </label>
          ))}
          <div className="col-span-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <Checkbox
                id="custom"
                checked={isCustomMode}
                onCheckedChange={() => handleUpiSelection("custom")}
              />
              <div className="flex-1">
                {isCustomMode ? (
                  <Input
                    value={customUpi}
                    onChange={(e) => handleCustomUpiChange(e.target.value)}
                    placeholder="Enter custom UPI name"
                    className="border-0 border-b border-gray-300 rounded-none focus:ring-0 focus:outline-none px-0 h-10 text-sm w-full bg-transparent placeholder:text-gray-400"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Custom UPI
                  </span>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};