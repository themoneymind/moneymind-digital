import { Search, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { useState } from "react";
import { format } from "date-fns";
import { TransactionEditDialog } from "./transaction/TransactionEditDialog";
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

  const toSentenceCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="p-6 mx-4 bg-white rounded-apple">
      <h2 className="mb-6 text-lg font-semibold pl-[44px]">Recent Transactions</h2>
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
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="grid grid-cols-[44px_1fr_auto_auto] items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50">
            <div
              className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${
                transaction.type === "expense"
                  ? "bg-red-50 text-red-500"
                  : "bg-green-50 text-green-500"
              }`}
            >
              <span className="text-xs font-medium">{transaction.category[0].toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {toSentenceCase(transaction.category)}
              </p>
              <div className="flex items-center gap-1">
                {transaction.description && (
                  <p className="text-xs text-gray-500 truncate">{transaction.description}</p>
                )}
                <p className="text-[10px] text-gray-400 whitespace-nowrap">
                  {format(transaction.date, "MMM d, h:mm a")}
                </p>
              </div>
            </div>
            <span
              className={`text-sm font-medium whitespace-nowrap px-4 mr-2 ${
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
                  className="h-8 w-8 hover:bg-gray-100 rounded-[10px] mr-2"
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleEditClick(transaction)}>
                  Edit Transaction
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
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
