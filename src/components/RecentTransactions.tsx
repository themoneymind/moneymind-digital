import { useFinance } from "@/contexts/FinanceContext";
import { useState } from "react";
import { Transaction } from "@/types/transactions";
import { TransactionEditDialog } from "./transaction/TransactionEditDialog";
import { TransactionFilters } from "./transaction/TransactionFilters";
import { TransactionList } from "./transaction/TransactionList";
import { startOfDay, startOfMonth, endOfMonth, isSameMonth } from "date-fns";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

interface RecentTransactionsProps {
  filterByType?: string;
  showViewAll?: boolean;
}

export const RecentTransactions = ({ 
  filterByType,
  showViewAll = true
}: RecentTransactionsProps) => {
  const { transactions, paymentSources, currentMonth } = useFinance();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense" | "date">("date");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  
  let availableTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    
    // First, filter by current month
    if (!isSameMonth(transactionDate, currentMonth)) return false;
    
    if (filterByType === "Credit Card") {
      const creditCardIds = paymentSources
        .filter(source => source.type === "Credit Card")
        .map(source => source.id);
      
      // For credit card view, include:
      // 1. Transactions where the source is a credit card
      // 2. Credit card payment transfers to this card
      return creditCardIds.includes(transaction.base_source_id) || 
        (transaction.type === "transfer" && 
         transaction.reference_type === "credit_card_payment" && 
         creditCardIds.includes(getBaseSourceId(transaction.display_source)));
    } else {
      // For main view, exclude credit card transactions except payments
      const source = paymentSources.find(s => s.id === transaction.base_source_id);
      const isSourceCreditCard = source?.type === "Credit Card";
      
      return !isSourceCreditCard || (transaction.type === "transfer" && transaction.reference_type === "credit_card_payment");
    }
  });

  // For credit card view, show payments as "Payment Received"
  if (filterByType === "Credit Card") {
    availableTransactions = availableTransactions.map(transaction => {
      if (transaction.type === "transfer" && transaction.reference_type === "credit_card_payment") {
        return {
          ...transaction,
          type: "income", // Show credit card payments as received in card view
          description: `Payment Received: ${transaction.description}`
        };
      }
      return transaction;
    });
  }

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
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
    <div className="bg-white rounded-apple">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        {showViewAll && (
          <TransactionFilters
            filter={filter}
            setFilter={setFilter}
            currentMonth={currentMonth}
            onSourceSelect={setSelectedSource}
          />
        )}
      </div>
      
      <div className="px-6 overflow-x-hidden">
        <TransactionList
          transactions={availableTransactions}
          filter={filter}
          selectedDate={currentMonth}
          selectedSource={selectedSource}
          onEdit={handleEdit}
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