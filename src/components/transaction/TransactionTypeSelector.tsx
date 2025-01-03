import { ArrowUp, ArrowDown, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";

type TransactionTypeSelectorProps = {
  type: TransactionType;
  onTypeChange: (type: TransactionType) => void;
};

export const TransactionTypeSelector = ({ type, onTypeChange }: TransactionTypeSelectorProps) => {
  return (
    <div className="flex gap-2 p-1 bg-gray-100/50 rounded-full">
      <Button
        variant="ghost"
        className={`flex-1 h-10 gap-2 text-sm font-medium transition-all duration-200 rounded-full ${
          type === "expense"
            ? "bg-red-500 text-white shadow-sm hover:bg-red-500"
            : "text-gray-600 hover:text-red-500 hover:bg-white/80"
        }`}
        onClick={() => onTypeChange("expense")}
      >
        Expense
      </Button>
      <Button
        variant="ghost"
        className={`flex-1 h-10 gap-2 text-sm font-medium transition-all duration-200 rounded-full ${
          type === "income"
            ? "bg-green-500 text-white shadow-sm hover:bg-green-500"
            : "text-gray-600 hover:text-green-500 hover:bg-white/80"
        }`}
        onClick={() => onTypeChange("income")}
      >
        Income
      </Button>
      <Button
        variant="ghost"
        className={`flex-1 h-10 gap-2 text-sm font-medium transition-all duration-200 rounded-full ${
          type === "transfer"
            ? "bg-[#7F3DFF] text-white shadow-sm hover:bg-[#7F3DFF]"
            : "text-gray-600 hover:text-[#7F3DFF] hover:bg-white/80"
        }`}
        onClick={() => onTypeChange("transfer")}
      >
        Transfer
      </Button>
    </div>
  );
};