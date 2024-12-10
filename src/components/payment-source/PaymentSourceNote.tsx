import { Check } from "lucide-react";

export const PaymentSourceNote = () => {
  return (
    <div className="space-y-4 bg-blue-50 p-4 rounded-[12px]">
      <h3 className="text-xs font-medium text-blue-900">Important Note</h3>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed">
            You can edit, add, or remove payment sources anytime from the dashboard.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Once completed, click the 'Complete' button to proceed.
          </p>
        </div>
      </div>
    </div>
  );
};