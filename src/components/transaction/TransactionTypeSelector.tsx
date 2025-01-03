import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";

type TransactionTypeSelectorProps = {
  type: TransactionType;
  onTypeChange: (type: TransactionType) => void;
};

export const TransactionTypeSelector = ({ type, onTypeChange }: TransactionTypeSelectorProps) => {
  return (
    <div className="flex gap-2 p-1 bg-[#F1F1F1] rounded-full mx-4">
      <Button
        variant="ghost"
        className={`flex-1 h-10 text-sm font-medium transition-all duration-200 rounded-full ${
          type === "expense"
            ? "bg-[#FF3B30] text-white shadow-sm hover:bg-[#FF3B30]"
            : "text-gray-600 hover:text-[#FF3B30] hover:bg-white/80"
        }`}
        onClick={() => onTypeChange("expense")}
      >
        Expense
      </Button>
      <Button
        variant="ghost"
        className={`flex-1 h-10 text-sm font-medium transition-all duration-200 rounded-full ${
          type === "income"
            ? "bg-[#FF3B30] text-white shadow-sm hover:bg-[#FF3B30]"
            : "text-gray-600 hover:text-[#FF3B30] hover:bg-white/80"
        }`}
        onClick={() => onTypeChange("income")}
      >
        Income
      </Button>
      <Button
        variant="ghost"
        className={`flex-1 h-10 text-sm font-medium transition-all duration-200 rounded-full ${
          type === "transfer"
            ? "bg-primary text-white shadow-sm hover:bg-primary/90"
            : "text-gray-600 hover:text-primary hover:bg-white/80"
        }`}
        onClick={() => onTypeChange("transfer")}
      >
        Transfer
      </Button>
    </div>
  );
};