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
        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
          transaction.type === "expense" 
            ? "bg-red-50" 
            : "bg-green-50"
        }`}>
          {transaction.type === "expense" ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
          ) : (
            <ArrowDownLeft className="w-3.5 h-3.5 text-green-500" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {toSentenceCase(transaction.category)}
          </span>
          <span className="text-xs text-gray-500">
            {format(new Date(transaction.date), "MMM d, yyyy")}
          </span>
          {transaction.description && (
            <span className="text-xs text-gray-500 mt-0.5">
              {transaction.description}
            </span>
          )}
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
          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 bg-white border border-gray-200 shadow-lg rounded-[12px] p-1">
            <DropdownMenuItem 
              onClick={() => onEdit(transaction)}
              className="gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(transaction.id)}
              className="gap-2 text-sm text-red-500 cursor-pointer hover:bg-gray-50 rounded-[8px]"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};