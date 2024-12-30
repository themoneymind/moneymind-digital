import { ChevronDown, ChevronUp } from "lucide-react";

type PaymentSourceInfoProps = {
  name: string;
  type: string;
  upiApps?: string[];
  linked?: boolean;
  showUpiList: boolean;
  setShowUpiList: (show: boolean) => void;
  onUpiToggle: (e: React.MouseEvent) => void;
};

export const PaymentSourceInfo = ({
  name,
  type,
  upiApps,
  linked,
  showUpiList,
  onUpiToggle,
}: PaymentSourceInfoProps) => {
  // Format bank name to always include "Bank" if not present
  const displayName = name.toLowerCase().includes("bank") ? name : `${name} Bank`;

  // For UPI variations: remove "Bank" from the name
  const getUpiDisplayName = (upiApp: string) => {
    const baseName = name.replace(/\s*bank\s*/i, "").trim();
    return `${baseName} ${upiApp}`;
  };

  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-col justify-center">
        <p className="text-sm font-medium text-gray-900 leading-tight">
          {displayName}
        </p>
        <span className="text-xs text-gray-500 leading-tight">{type}</span>
        {linked && upiApps && upiApps.length > 0 && (
          <button
            onClick={onUpiToggle}
            className="flex items-center gap-0.5 text-xs text-blue-600 w-fit mt-0.5"
          >
            {upiApps.length} UPI linked
            {showUpiList ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
      {showUpiList && upiApps && (
        <div className="space-y-0.5 mt-1">
          {upiApps.map((app) => (
            <div
              key={app}
              className="text-xs text-gray-600 pl-2 leading-tight"
            >
              {getUpiDisplayName(app)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};