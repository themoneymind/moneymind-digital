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
    <div className="group bg-white rounded-[16px] border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              transaction.type === "expense" ? "bg-red-50" : "bg-green-50"
            }`}
          >
            <IconComponent
              className={`w-4 h-4 ${
                transaction.type === "expense" ? "text-red-500" : "text-green-500"
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {toSentenceCase(transaction.category)}
            </p>
            {transaction.description && (
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {transaction.description}
              </p>
            )}
            <p className="text-[11px] text-gray-400 mt-0.5">
              {format(transaction.date, "MMM d, h:mm a")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 ml-auto">
          <span
            className={`text-sm font-medium whitespace-nowrap ${
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
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-gray-100"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem 
                onClick={() => onEdit(transaction)}
                className="gap-2 text-sm cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(transaction.id)}
                className="gap-2 text-sm text-red-500 focus:text-red-500 cursor-pointer"
              >
                <Trash className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};