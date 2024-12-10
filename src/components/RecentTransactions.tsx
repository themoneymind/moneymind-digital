import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionEditDialog } from "./transaction/TransactionEditDialog";
import { TransactionSearch } from "./transaction/TransactionSearch";
import { TransactionFilters } from "./transaction/TransactionFilters";
import { TransactionItem } from "./transaction/TransactionItem";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export const RecentTransactions = () => {
  const { transactions, currentMonth, setCurrentMonth } = useFinance();
  const [filter, setFilter] = useState<"all" | "income" | "expense" | "date">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactions[0] | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      filter === "all" ? true : 
      filter === "date" ? 
        isWithinInterval(new Date(transaction.date), {
          start: startOfMonth(currentMonth),
          end: endOfMonth(currentMonth)
        }) :
        transaction.type === filter;
    
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
        {filteredTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            formatCurrency={formatCurrency}
            toSentenceCase={toSentenceCase}
          />
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