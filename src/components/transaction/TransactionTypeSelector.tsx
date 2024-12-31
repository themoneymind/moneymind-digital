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
    <div className="flex gap-1 bg-muted p-1 rounded-lg">
      <Button
        type="button"
        variant={type === "income" ? "default" : "ghost"}
        onClick={() => onTypeChange("income")}
        className={`flex-1 h-9 gap-1.5 text-sm font-medium ${
          type === "income"
            ? "bg-[#00A86B] hover:bg-[#00A86B]/90 shadow-none"
            : "hover:bg-background/80"
        }`}
      >
        <ArrowDownLeft className="w-4 h-4" />
        Income
      </Button>
      <Button
        type="button"
        variant={type === "expense" ? "default" : "ghost"}
        onClick={() => onTypeChange("expense")}
        className={`flex-1 h-9 gap-1.5 text-sm font-medium ${
          type === "expense"
            ? "bg-[#FD3C4A] hover:bg-[#FD3C4A]/90 shadow-none"
            : "hover:bg-background/80"
        }`}
      >
        <ArrowUpRight className="w-4 h-4" />
        Expense
      </Button>
      <Button
        type="button"
        variant={type === "transfer" ? "default" : "ghost"}
        onClick={() => onTypeChange("transfer")}
        className={`flex-1 h-9 gap-1.5 text-sm font-medium ${
          type === "transfer"
            ? "bg-[#7F3DFF] hover:bg-[#7F3DFF]/90 shadow-none"
            : "hover:bg-background/80"
        }`}
      >
        <ArrowLeftRight className="w-4 h-4" />
        Transfer
      </Button>
    </div>
  );
};