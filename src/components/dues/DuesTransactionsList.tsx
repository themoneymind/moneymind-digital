import { useFinance } from "@/contexts/FinanceContext";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DueTransaction } from "@/types/dues";
import { DuesTransactionItem } from "./DuesTransactionItem";
import { DuesDialogs } from "./DuesDialogs";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useTransactionOperations } from "./hooks/useTransactionOperations";
import { useDialogState } from "./hooks/useDialogState";

export const DuesTransactionsList = () => {
  const { transactions, refreshData } = useFinance();
  const { dialogState, handlers } = useDialogState();
  const { handlePaymentSource, handlePartialPayment, handleExcuse } = useTransactionOperations();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter only due transactions
  const dueTransactions = transactions.filter(
    transaction => transaction.reference_type === 'due'
  ) as DueTransaction[];

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Due Transactions</h3>
      <div className="space-y-4">
        {dueTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-white rounded-2xl border border-gray-100">
            No due transactions yet
          </div>
        ) : (
          dueTransactions.map((transaction) => (
            <DuesTransactionItem
              key={transaction.id}
              transaction={transaction}
              onComplete={handlers.handleComplete}
              onPartial={handlers.handlePartial}
              onReschedule={handlers.handleReschedule}
              onReject={handlers.handleReject}
              onUndo={handlers.handleUndo}
              onDelete={handlers.handleDelete}
              formatCurrency={formatCurrency}
            />
          ))
        )}
      </div>

      <DuesDialogs
        dialogState={dialogState}
        handlers={handlers}
        onPaymentSourceSelect={handlePaymentSource}
        onPartialPaymentSourceSelect={handlePartialPayment}
        onExcuseSubmit={handleExcuse}
      />

      <DeleteConfirmationDialog
        isOpen={dialogState.showDeleteDialog}
        onClose={() => {
          handlers.setShowDeleteDialog(false);
          handlers.setSelectedTransaction(null);
        }}
        onConfirm={handlers.confirmDelete}
        amount={dialogState.selectedTransaction?.amount || 0}
      />
    </div>
  );
};