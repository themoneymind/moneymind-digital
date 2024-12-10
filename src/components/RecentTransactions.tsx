import { useState, useCallback } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionEditDialog } from "./transaction/TransactionEditDialog";
import { TransactionSearch } from "./transaction/TransactionSearch";
import { TransactionFilters } from "./transaction/TransactionFilters";
import { TransactionList } from "./transaction/TransactionList";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { Loader2 } from "lucide-react";

export const RecentTransactions = () => {
  const { transactions, currentMonth, setCurrentMonth, isLoading } = useFinance();
  const [filter, setFilter] = useState<"all" | "income" | "expense" | "date">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactions[0] | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const monthlyTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return isWithinInterval(transactionDate, {
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    });
  });

  const filteredTransactions = monthlyTransactions.filter((transaction) => {
    const matchesFilter = filter === "all" ? true : transaction.type === filter;
    const matchesSearch = transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleEditClick = useCallback((transaction: typeof transactions[0]) => {
    setSelectedTransaction(transaction);
    setShowEditDialog(true);
  }, []);

  const handleEditDialogClose = useCallback(() => {
    setShowEditDialog(false);
    // Use RAF to ensure state updates are properly batched
    requestAnimationFrame(() => {
      setSelectedTransaction(null);
    });
  }, []);

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
      
      <TransactionList
        transactions={filteredTransactions}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        formatCurrency={formatCurrency}
        toSentenceCase={toSentenceCase}
      />

      {selectedTransaction && (
        <TransactionEditDialog
          open={showEditDialog}
          onOpenChange={handleEditDialogClose}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};