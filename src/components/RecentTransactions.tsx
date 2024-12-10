import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionEditDialog } from "./transaction/TransactionEditDialog";
import { TransactionSearch } from "./transaction/TransactionSearch";
import { TransactionFilters } from "./transaction/TransactionFilters";
import { TransactionItem } from "./transaction/TransactionItem";
import { startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Loader2 } from "lucide-react";

export const RecentTransactions = () => {
  const { transactions, currentMonth, setCurrentMonth, isLoading } = useFinance();
  const [filter, setFilter] = useState<"all" | "income" | "expense" | "date">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactions[0] | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // First, filter transactions by the selected month
  const monthlyTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return isWithinInterval(transactionDate, {
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    });
  });

  // Then apply additional filters (type and search)
  const filteredTransactions = monthlyTransactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    
    // Apply type filter
    const matchesFilter =
      filter === "all" ? true : 
      filter === "date" ? 
        isWithinInterval(transactionDate, {
          start: startOfDay(currentMonth),
          end: endOfDay(currentMonth)
        }) :
        transaction.type === filter;
    
    // Apply search filter
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
    console.log("Delete transaction:", transactionId);
  };

  const toSentenceCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="p-5 mx-4 bg-white rounded-apple shadow-sm min-h-[200px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-5 mx-4 bg-white rounded-apple shadow-sm">
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
      </div>
      
      <TransactionSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <TransactionFilters 
        filter={filter}
        setFilter={setFilter}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />
      
      <div className="mt-4 space-y-2 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              formatCurrency={formatCurrency}
              toSentenceCase={toSentenceCase}
            />
          ))
        )}
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