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
  upiApps = [],
  linked,
  showUpiList,
  onUpiToggle,
}: PaymentSourceInfoProps) => {
  console.log("PaymentSourceInfo - props:", { name, type, upiApps, linked, showUpiList });
  const hasUpiApps = Array.isArray(upiApps) && upiApps.length > 0;

  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-col justify-center">
        <p className="text-sm font-medium text-gray-900 leading-tight">
          {name}
        </p>
        <span className="text-xs text-gray-500 leading-tight">{type}</span>
        {linked && hasUpiApps && (
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
      {showUpiList && hasUpiApps && (
        <div className="space-y-0.5 mt-1">
          {upiApps.map((app, index) => (
            <div
              key={`${app}-${index}`}
              className="text-xs text-gray-600 pl-2 leading-tight"
            >
              {`${name} ${app}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};