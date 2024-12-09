import { Search, MoreVertical, Pencil, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { useState } from "react";
import { format } from "date-fns";
import { TransactionEditDialog } from "./transaction/TransactionEditDialog";
import { getCategoryIcon } from "@/utils/categoryIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const RecentTransactions = () => {
  const { transactions } = useFinance();
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactions[0] | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      filter === "all" ? true : transaction.type === filter;
    const matchesSearch = transaction.category
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleEditClick = (transaction: typeof transactions[0]) => {
    setSelectedTransaction(transaction);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (transactionId: string) => {
    // TODO: Implement delete functionality when backend is ready
    console.log("Delete transaction:", transactionId);
  };

  const toSentenceCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="p-6 mx-4 bg-white rounded-apple">
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="pl-10 h-12 border-gray-200 rounded-apple"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mb-6">
        <Button
          className={`rounded-apple px-6 ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          className={`rounded-apple px-6 ${
            filter === "income" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
          variant={filter === "income" ? "default" : "outline"}
          onClick={() => setFilter("income")}
        >
          Income
        </Button>
        <Button
          className={`rounded-apple px-6 ${
            filter === "expense" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
          variant={filter === "expense" ? "default" : "outline"}
          onClick={() => setFilter("expense")}
        >
          Expense
        </Button>
      </div>
      <div className="space-y-1">
        {filteredTransactions.map((transaction) => {
          const IconComponent = getCategoryIcon(transaction.category);
          return (
            <div key={transaction.id} className="border-b border-gray-100 last:border-0">
              <div className="flex items-center justify-between py-3 px-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      transaction.type === "expense"
                        ? "bg-red-50"
                        : "bg-green-50"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        transaction.type === "expense"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {toSentenceCase(transaction.category)}
                    </p>
                    {transaction.description && (
                      <p className="text-xs text-gray-500 truncate">
                        {transaction.description}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {format(transaction.date, "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
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
                        className="h-8 w-8 hover:bg-gray-100 rounded-[8px]"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem 
                        onClick={() => handleEditClick(transaction)}
                        className="gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(transaction.id)}
                        className="gap-2 text-red-500 focus:text-red-500"
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
        })}
      </div>

      {selectedTransaction && (
        <TransactionEditDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};