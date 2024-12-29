import { useFinance } from "@/contexts/FinanceContext";
import { TransactionItem } from "./transaction/TransactionItem";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Transaction } from "@/types/transactions";
import { useState } from "react";
import { TransactionEditDialog } from "./transaction/TransactionEditDialog";
import { TransactionFilters } from "./transaction/TransactionFilters";

interface RecentTransactionsProps {
  showViewAll?: boolean;
  filterByType?: string;
}

export const RecentTransactions = ({ 
  showViewAll = false,
  filterByType
}: RecentTransactionsProps) => {
  const { transactions, paymentSources, currentMonth } = useFinance();
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense" | "date">("all");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  
  let filteredTransactions = transactions;
  
  // Apply source type filter (Credit Card)
  if (filterByType === "Credit Card") {
    const creditCardIds = paymentSources
      .filter(source => source.type === "Credit Card")
      .map(source => source.id);
    
    filteredTransactions = transactions.filter(t => 
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
  
  const recentTransactions = filteredTransactions.slice(0, showViewAll ? undefined : 5);

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
    <div className="space-y-4">
      {showViewAll && (
        <div className="flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/app/transactions")}
          >
            View All
          </Button>
        </div>
      )}
      
      <div className="px-6">
        <TransactionFilters
          filter={filter}
          setFilter={setFilter}
          currentMonth={currentMonth}
          setCurrentMonth={() => {}}
          onSourceSelect={setSelectedSource}
        />
      </div>
      
      <div className="px-6 space-y-4">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions yet
          </div>
        ) : (
          recentTransactions.map((transaction) => (
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