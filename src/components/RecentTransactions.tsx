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
    return isSameMonth(transactionDate, currentMonth);
  });

  if (filterByType === "Credit Card") {
    const creditCardIds = paymentSources
      .filter(source => source.type === "Credit Card")
      .map(source => source.id);
    
    availableTransactions = availableTransactions.filter(t => {
      // Include transactions where:
      // 1. The source is a credit card
      // 2. OR it's a credit card payment (transfer) to this card
      return creditCardIds.includes(t.base_source_id) || 
        (t.reference_type === "credit_card_payment" && creditCardIds.includes(getBaseSourceId(t.display_source)));
    });

    // For credit card view, show payments as "Payment Received"
    availableTransactions = availableTransactions.map(t => {
      if (t.reference_type === "credit_card_payment") {
        return {
          ...t,
          type: "income", // Show credit card payments as received in card view
          description: `Payment Received: ${t.description}`
        };
      }
      return t;
    });
  } else {
    // In main view, show credit card payments as expenses
    availableTransactions = availableTransactions.map(t => {
      if (t.reference_type === "credit_card_payment") {
        return {
          ...t,
          type: "expense", // Show as expense in main view
          description: `Credit Card Payment: ${t.description}`
        };
      }
      return t;
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