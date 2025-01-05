import { useFinance } from "@/contexts/FinanceContext";
import { supabase } from "@/integrations/supabase/client";
import { DueTransaction } from "@/types/dues";
import { toast } from "sonner";
import { useDuesOperations } from "@/hooks/useDuesOperations";
import { useDuesDialogState } from "@/hooks/useDuesDialogState";
import { DuesDialogManager } from "./DuesDialogManager";
import { DuesTransactionList } from "./DuesTransactionList";
import { useState } from "react";

export const DuesTransactionsList = () => {
  const { transactions, refreshData } = useFinance();
  const dialogState = useDuesDialogState();
  const {
    partialAmount,
    setPartialAmount,
    excuseReason,
    setExcuseReason,
    newRepaymentDate,
    setNewRepaymentDate,
    updateTransactionStatus,
    handlePaymentSourceSelect,
    handlePartialPaymentSourceSelect,
  } = useDuesOperations(refreshData);

  const handleExcuseSubmit = async () => {
    if (!dialogState.selectedTransaction || !excuseReason || !newRepaymentDate) return;

    await updateTransactionStatus(dialogState.selectedTransaction.id, 'payment_scheduled', {
      excuse_reason: excuseReason,
      repayment_date: newRepaymentDate.toISOString(),
      next_reminder_date: newRepaymentDate.toISOString()
    });

    dialogState.setShowExcuseDialog(false);
    setExcuseReason("");
    setNewRepaymentDate(undefined);
    dialogState.setSelectedTransaction(null);
  };

  const handleEditSave = async (updates: Partial<DueTransaction>) => {
    if (!dialogState.selectedTransaction) return;

    try {
      const formattedUpdates = {
        ...updates,
        date: updates.date ? new Date(updates.date).toISOString() : undefined,
        repayment_date: updates.repayment_date ? new Date(updates.repayment_date).toISOString() : undefined,
        next_reminder_date: updates.next_reminder_date ? new Date(updates.next_reminder_date).toISOString() : undefined,
      };

      const { error } = await supabase
        .from('transactions')
        .update(formattedUpdates)
        .eq('id', dialogState.selectedTransaction.id);

      if (error) throw error;

      await refreshData();
      toast.success("Due transaction updated successfully");
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    }
  };

  const handleUndo = async (transaction: DueTransaction) => {
    if (!transaction.previous_status) return;

    try {
      const { data: repaymentTransaction } = await supabase
        .from('transactions')
        .select('*')
        .eq('reference_type', 'due_repayment')
        .eq('reference_id', transaction.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (repaymentTransaction) {
        await supabase
          .from('transactions')
          .delete()
          .eq('id', repaymentTransaction.id);
      }

      await updateTransactionStatus(transaction.id, transaction.previous_status, {
        remaining_balance: transaction.amount,
        previous_status: null
      });

      toast.success("Transaction successfully undone");
    } catch (error) {
      console.error("Error undoing transaction:", error);
      toast.error("Failed to undo transaction");
    }
  };

  // Filter only active due transactions
  const dueTransactions = transactions.filter(
    transaction => transaction.reference_type === 'due'
  ) as DueTransaction[];

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-base font-semibold">Due Transactions</h3>
      
      <DuesTransactionList
        transactions={dueTransactions}
        onComplete={(t) => {
          dialogState.setSelectedTransaction(t);
          dialogState.setShowPaymentSourceDialog(true);
        }}
        onPartial={(t) => {
          dialogState.setSelectedTransaction(t);
          dialogState.setShowPartialDialog(true);
        }}
        onReschedule={(t) => {
          dialogState.setSelectedTransaction(t);
          dialogState.setShowExcuseDialog(true);
        }}
        onEdit={(t) => {
          dialogState.setSelectedTransaction(t);
          dialogState.setShowEditDialog(true);
        }}
        onUndo={handleUndo}
        onDelete={(t) => {
          dialogState.setSelectedTransaction(t);
          dialogState.setShowDeleteDialog(true);
        }}
      />

      <DuesDialogManager
        dialogState={dialogState}
        partialAmount={partialAmount}
        setPartialAmount={setPartialAmount}
        excuseReason={excuseReason}
        setExcuseReason={setExcuseReason}
        newRepaymentDate={newRepaymentDate}
        setNewRepaymentDate={setNewRepaymentDate}
        handleExcuseSubmit={handleExcuseSubmit}
        handlePaymentSourceSelect={handlePaymentSourceSelect}
        handlePartialPaymentSourceSelect={handlePartialPaymentSourceSelect}
        handleEditSave={handleEditSave}
      />
    </div>
  );
};