import { format } from "date-fns";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCategoryIcon } from "@/utils/categoryIcons";

type TransactionItemProps = {
  transaction: {
    id: string;
    type: "income" | "expense";
    category: string;
    description?: string;
    date: Date;
    amount: number;
  };
  onEdit: (transaction: any) => void;
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
  const IconComponent = getCategoryIcon(transaction.category);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between py-2 px-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              transaction.type === "expense" ? "bg-red-50" : "bg-green-50"
            }`}
          >
            <IconComponent
              className={`w-3 h-3 ${
                transaction.type === "expense" ? "text-red-500" : "text-green-500"
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-900">
              {toSentenceCase(transaction.category)}
            </p>
            {transaction.description && (
              <p className="text-[11px] text-gray-500 truncate mt-0.5">
                {transaction.description}
              </p>
            )}
            <p className="text-[10px] text-gray-400 mt-0.5">
              {format(transaction.date, "MMM d, h:mm a")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-5 ml-auto pr-0">
          <span
            className={`text-xs font-medium whitespace-nowrap ${
              transaction.type === "expense" ? "text-red-500" : "text-green-500"
            }`}
          >
            {transaction.type === "expense" ? "-" : "+"}
            {formatCurrency(transaction.amount)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-transparent rounded-[8px]"
              >
                <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem 
                onClick={() => onEdit(transaction)}
                className="gap-2 text-xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(transaction.id)}
                className="gap-2 text-xs text-red-500 focus:text-red-500"
              >
                <Trash className="w-3.5 h-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};