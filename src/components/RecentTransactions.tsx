import { useFinance } from "@/contexts/FinanceContext";
import { useState } from "react";
import { Transaction } from "@/types/transactions";
import { TransactionEditDialog } from "./transaction/TransactionEditDialog";
import { TransactionFilters } from "./transaction/TransactionFilters";
import { TransactionList } from "./transaction/TransactionList";
import { startOfDay } from "date-fns";

interface RecentTransactionsProps {
  filterByType?: string;
}

export const RecentTransactions = ({ 
  filterByType
}: RecentTransactionsProps) => {
  const { transactions, paymentSources } = useFinance();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense" | "date">("date");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfDay(new Date()));
  
  // Filter credit card transactions if needed
  let availableTransactions = transactions;
  if (filterByType === "Credit Card") {
    const creditCardIds = paymentSources
      .filter(source => source.type === "Credit Card")
      .map(source => source.id);
    
    availableTransactions = transactions.filter(t => 
      creditCardIds.includes(t.source)
    );
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
    <div className="bg-white rounded-apple shadow-sm space-y-4 mb-6">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
      </div>
      
      <div className="px-6">
        <TransactionFilters
          filter={filter}
          setFilter={setFilter}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          onSourceSelect={setSelectedSource}
        />
      </div>
      
      <div className="px-6 pb-6 max-h-[500px] overflow-y-auto">
        <TransactionList
          transactions={availableTransactions}
          filter={filter}
          selectedDate={currentMonth}
          selectedSource={selectedSource}
          onEdit={handleEdit}
          onDelete={handleDelete}
          formatCurrency={formatCurrency}
          toSentenceCase={toSentenceCase}
        />
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