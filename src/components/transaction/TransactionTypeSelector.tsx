import { ArrowUp, ArrowDown, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";

type TransactionTypeSelectorProps = {
  type: TransactionType;
  onTypeChange: (type: TransactionType) => void;
};

export const TransactionTypeSelector = ({ type, onTypeChange }: TransactionTypeSelectorProps) => {
  return (
    <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-xl">
      <Button
        variant="ghost"
        className={`flex-1 rounded-lg h-9 gap-1.5 text-sm ${
          type === "expense"
            ? "bg-white shadow-sm text-red-500"
            : "hover:bg-white/50 text-gray-600"
        }`}
        onClick={() => onTypeChange("expense")}
      >
        <ArrowUp className="w-3.5 h-3.5" />
        Expense
      </Button>
      <Button
        variant="ghost"
        className={`flex-1 rounded-lg h-9 gap-1.5 text-sm ${
          type === "income"
            ? "bg-white shadow-sm text-green-500"
            : "hover:bg-white/50 text-gray-600"
        }`}
        onClick={() => onTypeChange("income")}
      >
        <ArrowDown className="w-3.5 h-3.5" />
        Income
      </Button>
      <Button
        variant="ghost"
        className={`flex-1 rounded-lg h-9 gap-1.5 text-sm ${
          type === "transfer"
            ? "bg-white shadow-sm text-[#7F3DFF]"
            : "hover:bg-white/50 text-gray-600"
        }`}
        onClick={() => onTypeChange("transfer")}
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
        Transfer
      </Button>
    </div>
  );
};