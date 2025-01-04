import { Transaction } from "@/types/transactions";
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";

type TransactionItemProps = {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  formatCurrency: (amount: number) => string;
  toSentenceCase: (str: string) => string;
};

export const TransactionItem = ({
  transaction,
  onEdit,
  formatCurrency,
  toSentenceCase,
}: TransactionItemProps) => {
  const getIconAndColor = () => {
    switch (transaction.type) {
      case "expense":
        return {
          icon: <ArrowUpRight className="w-4 h-4 text-[#FF1122]" />,
          bgColor: "bg-[#FF1122]/10",
          textColor: "text-[#FF1122]"
        };
      case "income":
        return {
          icon: <ArrowDownLeft className="w-4 h-4 text-[#00AF1E]" />,
          bgColor: "bg-[#00AF1E]/10",
          textColor: "text-[#00AF1E]"
        };
      case "transfer":
        return {
          icon: <ArrowLeftRight className="w-4 h-4 text-[#7F3DFF]" />,
          bgColor: "bg-[#7F3DFF]/10",
          textColor: "text-[#7F3DFF]"
        };
      default:
        return {
          icon: <ArrowUpRight className="w-4 h-4 text-gray-500" />,
          bgColor: "bg-gray-50",
          textColor: "text-gray-600"
        };
    }
  };

  const { icon, bgColor, textColor } = getIconAndColor();

  return (
    <div 
      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-xl border border-gray-100 cursor-pointer"
      onClick={() => onEdit(transaction)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor}`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {toSentenceCase(transaction.category)}
            </span>
            {transaction.repeat_frequency && transaction.repeat_frequency !== "never" && (
              <ArrowLeftRight className="w-3 h-3 text-blue-500" />
            )}
          </div>
          <div className="flex flex-col text-xs text-gray-500">
            <span>{transaction.display_source || "Unknown Source"}</span>
            <span>{format(new Date(transaction.date), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
      <span className={`text-sm font-medium ${textColor}`}>
        {transaction.type === "expense" ? "-" : "+"}
        {formatCurrency(Number(transaction.amount))}
      </span>
    </div>
  );
};