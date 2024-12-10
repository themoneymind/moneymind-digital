import { CircleCheck } from "lucide-react";

export const PaymentSourceNote = () => {
  return (
    <div className="space-y-3 bg-blue-50 p-4 rounded-[12px]">
      <h3 className="text-xs font-medium text-blue-900">Important Note</h3>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <CircleCheck className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed">
            You can add bank accounts, UPIs, and credit cards to track your expenses effortlessly.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CircleCheck className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed">
            You can link multiple bank accounts, credit cards, and UPIs to manage your expenses seamlessly.
          </p>
        </div>
      </div>
    </div>
  );
};