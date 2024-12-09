import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";

type TransactionTypeSelectorProps = {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
};

export const TransactionTypeSelector = ({ value, onChange }: TransactionTypeSelectorProps) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant="outline"
        className={`flex-1 rounded-[12px] h-14 gap-2 ${
          value === "expense"
            ? "bg-red-50 text-red-500 border-red-100 hover:bg-red-50"
            : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => onChange("expense")}
      >
        <ArrowUp className="w-4 h-4" />
        Expense
      </Button>
      <Button
        variant="outline"
        className={`flex-1 rounded-[12px] h-14 gap-2 ${
          value === "income"
            ? "bg-green-50 text-green-500 border-green-100 hover:bg-green-50"
            : "bg-white hover:bg-gray-50"
        }`}
        onClick={() => onChange("income")}
      >
        <ArrowDown className="w-4 h-4" />
        Income
      </Button>
    </div>
  );
};