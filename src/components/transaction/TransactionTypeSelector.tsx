import { ArrowUp, ArrowDown, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";

type TransactionTypeSelectorProps = {
  type: TransactionType;
  onTypeChange: (type: TransactionType) => void;
};

export const TransactionTypeSelector = ({ type, onTypeChange }: TransactionTypeSelectorProps) => {
  return (
    <div className="flex gap-1 p-1 bg-gray-50 rounded-2xl mb-6">
      <Button
        variant="ghost"
        className={`flex-1 rounded-xl py-2.5 gap-1.5 text-sm font-medium ${
          type === "expense"
            ? "bg-white shadow-sm text-red-500"
            : "hover:bg-white/50 text-gray-500"
        }`}
        onClick={() => onTypeChange("expense")}
      >
        <ArrowUp className="w-4 h-4" />
        Expense
      </Button>
      <Button
        variant="ghost"
        className={`flex-1 rounded-xl py-2.5 gap-1.5 text-sm font-medium ${
          type === "income"
            ? "bg-white shadow-sm text-green-500"
            : "hover:bg-white/50 text-gray-500"
        }`}
        onClick={() => onTypeChange("income")}
      >
        <ArrowDown className="w-4 h-4" />
        Income
      </Button>
      <Button
        variant="ghost"
        className={`flex-1 rounded-xl py-2.5 gap-1.5 text-sm font-medium ${
          type === "transfer"
            ? "bg-white shadow-sm text-[#7F3DFF]"
            : "hover:bg-white/50 text-gray-500"
        }`}
        onClick={() => onTypeChange("transfer")}
      >
        <ArrowLeftRight className="w-4 h-4" />
        Transfer
      </Button>
    </div>
  );
};