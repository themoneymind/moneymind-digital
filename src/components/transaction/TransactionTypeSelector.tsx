import { ArrowDownIcon, ArrowUpIcon, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";

type TransactionTypeSelectorProps = {
  type: TransactionType | "transfer";
  onTypeChange: (type: TransactionType | "transfer") => void;
};

export const TransactionTypeSelector = ({
  type,
  onTypeChange,
}: TransactionTypeSelectorProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className={`flex-1 h-14 rounded-[12px] ${
          type === "income"
            ? "bg-[#00A86B] text-white hover:bg-[#00A86B]/90"
            : ""
        }`}
        onClick={() => onTypeChange("income")}
      >
        <ArrowDownIcon className="w-5 h-5 mr-2" />
        Income
      </Button>
      <Button
        variant="outline"
        className={`flex-1 h-14 rounded-[12px] ${
          type === "expense"
            ? "bg-[#FD3C4A] text-white hover:bg-[#FD3C4A]/90"
            : ""
        }`}
        onClick={() => onTypeChange("expense")}
      >
        <ArrowUpIcon className="w-5 h-5 mr-2" />
        Expense
      </Button>
      <Button
        variant="outline"
        className={`flex-1 h-14 rounded-[12px] ${
          type === "transfer"
            ? "bg-[#7F3DFF] text-white hover:bg-[#7F3DFF]/90"
            : ""
        }`}
        onClick={() => onTypeChange("transfer")}
      >
        <ArrowLeftRight className="w-5 h-5 mr-2" />
        Transfer
      </Button>
    </div>
  );
};