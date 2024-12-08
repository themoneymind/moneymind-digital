import { ArrowLeft, ArrowRight } from "lucide-react";

export const MonthSelector = () => {
  return (
    <div className="flex items-center justify-between p-4 mx-4 bg-white rounded-lg">
      <button className="p-2">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <span className="text-lg font-medium">December 2024</span>
      <button className="p-2">
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};