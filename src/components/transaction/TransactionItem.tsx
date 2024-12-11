import { Transaction } from "@/types/transactions";
import { MoreHorizontal, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

type TransactionItemProps = {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
  toSentenceCase: (str: string) => string;
};

export const TransactionItem = ({
  transaction,
  onEdit,
  onDelete,
  formatCurrency,
  toSentenceCase,
}: TransactionItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-xl border border-gray-100">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          transaction.type === "expense" 
            ? "bg-red-50" 
            : "bg-green-50"
        }`}>
          {transaction.type === "expense" ? (
            <ArrowUpRight className="w-5 h-5 text-red-500" />
          ) : (
            <ArrowDownLeft className="w-5 h-5 text-green-500" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {toSentenceCase(transaction.category)}
          </span>
          <span className="text-xs text-gray-500">
            {format(new Date(transaction.date), "MMM d, yyyy")}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`text-sm font-medium ${
            transaction.type === "expense" ? "text-red-600" : "text-green-600"
          }`}
        >
          {transaction.type === "expense" ? "-" : "+"}
          {formatCurrency(Number(transaction.amount))}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onEdit(transaction)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(transaction.id)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};