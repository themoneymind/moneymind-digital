import { useFinance } from "@/contexts/FinanceContext";
import { TransactionItem } from "./transaction/TransactionItem";
import { useState } from "react";
import { Transaction } from "@/types/transactions";
import { TransactionEditDialog } from "./transaction/TransactionEditDialog";
import { TransactionFilters } from "./transaction/TransactionFilters";
import { startOfDay, endOfDay, isEqual } from "date-fns";

interface RecentTransactionsProps {
  showViewAll?: boolean;
  filterByType?: string;
}

export const RecentTransactions = ({ 
  filterByType
}: RecentTransactionsProps) => {
  const { transactions, paymentSources, currentMonth } = useFinance();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense" | "date">("all");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  
  let filteredTransactions = transactions;
  
  // Filter by date (today by default)
  const today = new Date();
  const selectedDate = filter === "date" ? currentMonth : today;
  
  filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return isEqual(startOfDay(transactionDate), startOfDay(selectedDate));
  });

  // Apply source type filter (Credit Card)
  if (filterByType === "Credit Card") {
    const creditCardIds = paymentSources
      .filter(source => source.type === "Credit Card")
      .map(source => source.id);
    
    filteredTransactions = filteredTransactions.filter(t => 
      creditCardIds.includes(t.source)
    );
  }

  // Apply transaction type filter
  if (filter === "income") {
    filteredTransactions = filteredTransactions.filter(t => t.type === "income");
  } else if (filter === "expense") {
    filteredTransactions = filteredTransactions.filter(t => t.type === "expense");
  }

  // Apply source filter
  if (selectedSource) {
    filteredTransactions = filteredTransactions.filter(t => t.source === selectedSource);
  }

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    console.log('Delete transaction:', id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toSentenceCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="bg-white rounded-apple shadow-sm space-y-4">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
      </div>
      
      <div className="px-6">
        <TransactionFilters
          filter={filter}
          setFilter={setFilter}
          currentMonth={currentMonth}
          setCurrentMonth={() => {}}
          onSourceSelect={setSelectedSource}
        />
      </div>
      
      <div className="px-6 pb-6 space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions for {filter === "date" ? "selected date" : "today"}
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={handleEdit}
              onDelete={handleDelete}
              formatCurrency={formatCurrency}
              toSentenceCase={toSentenceCase}
            />
          ))
        )}
      </div>

      {selectedTransaction && (
        <TransactionEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};