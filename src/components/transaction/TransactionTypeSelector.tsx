import { Button } from "@/components/ui/button";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";

type TransactionTypeSelectorProps = {
  type: "income" | "expense" | "transfer";
  onTypeChange: (type: "income" | "expense" | "transfer") => void;
};

export const TransactionTypeSelector = ({
  type,
  onTypeChange,
}: TransactionTypeSelectorProps) => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant={type === "income" ? "default" : "outline"}
        onClick={() => onTypeChange("income")}
        className={`flex-1 h-12 gap-2 rounded-[12px] ${
          type === "income"
            ? "bg-[#00A86B] hover:bg-[#00A86B]/90"
            : "hover:bg-gray-100"
        }`}
      >
        <ArrowDownLeft className="w-5 h-5" />
        Income
      </Button>
      <Button
        type="button"
        variant={type === "expense" ? "default" : "outline"}
        onClick={() => onTypeChange("expense")}
        className={`flex-1 h-12 gap-2 rounded-[12px] ${
          type === "expense"
            ? "bg-[#FD3C4A] hover:bg-[#FD3C4A]/90"
            : "hover:bg-gray-100"
        }`}
      >
        <ArrowUpRight className="w-5 h-5" />
        Expense
      </Button>
      <Button
        type="button"
        variant={type === "transfer" ? "default" : "outline"}
        onClick={() => onTypeChange("transfer")}
        className={`flex-1 h-12 gap-2 rounded-[12px] ${
          type === "transfer"
            ? "bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
            : "hover:bg-gray-100"
        }`}
      >
        <ArrowLeftRight className="w-5 h-5" />
        Transfer
      </Button>
    </div>
  );
};