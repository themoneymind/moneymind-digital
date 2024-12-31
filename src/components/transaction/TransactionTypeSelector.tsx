import { ArrowUp, ArrowDown, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";

type TransactionTypeSelectorProps = {
  type: TransactionType;
  onTypeChange: (type: TransactionType) => void;
};

export const TransactionTypeSelector = ({ type, onTypeChange }: TransactionTypeSelectorProps) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant="outline"
        className={`flex-1 rounded-[12px] h-14 gap-2 ${
          type === "expense"
            ? "bg-red-50 text-red-500 border-red-100 hover:bg-red-50"
            : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => onTypeChange("expense")}
      >
        <ArrowUp className="w-4 h-4" />
        Expense
      </Button>
      <Button
        variant="outline"
        className={`flex-1 rounded-[12px] h-14 gap-2 ${
          type === "income"
            ? "bg-green-50 text-green-500 border-green-100 hover:bg-green-50"
            : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => onTypeChange("income")}
      >
        <ArrowDown className="w-4 h-4" />
        Income
      </Button>
      <Button
        variant="outline"
        className={`flex-1 rounded-[12px] h-14 gap-2 ${
          type === "transfer"
            ? "bg-purple-50 text-[#7F3DFF] border-purple-100 hover:bg-purple-50"
            : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => onTypeChange("transfer")}
      >
        <ArrowLeftRight className="w-4 h-4" />
        Transfer
      </Button>
    </div>
  );
};