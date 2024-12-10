import { Transaction } from "@/types/transactions";
import { MoreHorizontal } from "lucide-react";
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
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
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
          <DropdownMenuContent align="end">
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