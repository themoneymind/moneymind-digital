import { ArrowUp, ArrowDown, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";

type TransactionTypeSelectorProps = {
  type: TransactionType;
  onTypeChange: (type: TransactionType) => void;
};

export const TransactionTypeSelector = ({ type, onTypeChange }: TransactionTypeSelectorProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant="outline"
        className={`flex-1 rounded-xl h-10 gap-1.5 text-sm ${
          type === "expense"
            ? "bg-red-50 text-red-500 border-red-100 hover:bg-red-50"
            : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => onTypeChange("expense")}
      >
        <ArrowUp className="w-3.5 h-3.5" />
        Expense
      </Button>
      <Button
        variant="outline"
        className={`flex-1 rounded-xl h-10 gap-1.5 text-sm ${
          type === "income"
            ? "bg-green-50 text-green-500 border-green-100 hover:bg-green-50"
            : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => onTypeChange("income")}
      >
        <ArrowDown className="w-3.5 h-3.5" />
        Income
      </Button>
      <Button
        variant="outline"
        className={`flex-1 rounded-xl h-10 gap-1.5 text-sm ${
          type === "transfer"
            ? "bg-purple-50 text-[#7F3DFF] border-purple-100 hover:bg-purple-50"
            : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => onTypeChange("transfer")}
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
        Transfer
      </Button>
    </div>
  );
};