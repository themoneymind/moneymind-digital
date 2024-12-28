import { useState } from "react";
import { DueTransaction } from "@/types/dues";
import { supabase } from "@/integrations/supabase/client";
import { useFinance } from "@/contexts/FinanceContext";
import { toast } from "sonner";

export const useDuesListOperations = () => {
  const { refreshData } = useFinance();
  const [selectedTransaction, setSelectedTransaction] = useState<DueTransaction | null>(null);
  const [showPartialDialog, setShowPartialDialog] = useState(false);
  const [showPaymentSourceDialog, setShowPaymentSourceDialog] = useState(false);
  const [showExcuseDialog, setShowExcuseDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [partialAmount, setPartialAmount] = useState<string>("");
  const [excuseReason, setExcuseReason] = useState("");
  const [newRepaymentDate, setNewRepaymentDate] = useState<Date>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const updateTransactionStatus = async (
    transactionId: string,
    status: string,
    additionalData: any = {}
  ) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status, ...additionalData })
        .eq('id', transactionId);

      if (error) throw error;

      await refreshData();
      toast.success("Transaction updated successfully");
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    }
  };

  const handlePaymentSourceSelect = async (sourceId: string) => {
    if (!selectedTransaction) return;
    await updateTransactionStatus(selectedTransaction.id, 'completed');
    setShowPaymentSourceDialog(false);
    setSelectedTransaction(null);
  };

  const handlePartialPaymentSourceSelect = async (sourceId: string) => {
    if (!selectedTransaction || !partialAmount) return;
    const amount = parseFloat(partialAmount);
    
    await updateTransactionStatus(selectedTransaction.id, 'partially_paid', {
      remaining_balance: selectedTransaction.amount - amount
    });
    
    setShowPartialDialog(false);
    setPartialAmount("");
    setSelectedTransaction(null);
  };

  const handleComplete = (transaction: DueTransaction) => {
    setSelectedTransaction(transaction);
    setShowPaymentSourceDialog(true);
  };

  const handlePartial = (transaction: DueTransaction) => {
    setSelectedTransaction(transaction);
    setShowPartialDialog(true);
  };

  const handleReschedule = (transaction: DueTransaction) => {
    setSelectedTransaction(transaction);
    setShowExcuseDialog(true);
  };

  const handleEdit = (transaction: DueTransaction) => {
    setSelectedTransaction(transaction);
    setShowEditDialog(true);
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

  const handleDelete = (transaction: DueTransaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteDialog(true);
  };

  const handleExcuseSubmit = async () => {
    if (!selectedTransaction || !excuseReason || !newRepaymentDate) return;

    await updateTransactionStatus(selectedTransaction.id, 'payment_scheduled', {
      excuse_reason: excuseReason,
      repayment_date: newRepaymentDate.toISOString(),
      next_reminder_date: newRepaymentDate.toISOString()
    });

    setShowExcuseDialog(false);
    setExcuseReason("");
    setNewRepaymentDate(undefined);
    setSelectedTransaction(null);
  };

  const handleEditSave = async (updates: Partial<DueTransaction>) => {
    if (!selectedTransaction) return;

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
        .eq('id', selectedTransaction.id);

      if (error) throw error;

      await refreshData();
      toast.success("Due transaction updated successfully");
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    }
  };

  return {
    selectedTransaction,
    dialogStates: {
      showPartialDialog,
      setShowPartialDialog,
      showPaymentSourceDialog,
      setShowPaymentSourceDialog,
      showExcuseDialog,
      setShowExcuseDialog,
      showDeleteDialog,
      setShowDeleteDialog,
      showEditDialog,
      setShowEditDialog,
      partialAmount,
      setPartialAmount,
      excuseReason,
      setExcuseReason,
      newRepaymentDate,
      setNewRepaymentDate,
      isDropdownOpen,
      setIsDropdownOpen,
    },
    handlers: {
      handleComplete,
      handlePartial,
      handleReschedule,
      handleEdit,
      handleUndo,
      handleDelete,
      handleExcuseSubmit,
      handleEditSave,
      handlePaymentSourceSelect,
      handlePartialPaymentSourceSelect,
    },
  };
};