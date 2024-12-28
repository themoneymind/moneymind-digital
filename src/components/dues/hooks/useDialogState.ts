import { useState } from "react";
import { DueTransaction } from "@/types/dues";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useDialogState = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<DueTransaction | null>(null);
  const [showPartialDialog, setShowPartialDialog] = useState(false);
  const [showPaymentSourceDialog, setShowPaymentSourceDialog] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");
  const [excuseReason, setExcuseReason] = useState("");
  const [showExcuseDialog, setShowExcuseDialog] = useState(false);
  const [newRepaymentDate, setNewRepaymentDate] = useState<Date>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleReject = async (id: string) => {
    try {
      await updateTransactionStatus(id, 'rejected');
      toast.success("Transaction rejected successfully");
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      toast.error("Failed to reject transaction");
    }
  };

  const handleUndo = async (transaction: DueTransaction) => {
    if (!transaction.previous_status) return;

    try {
      // Find and reverse the repayment transaction
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

  const confirmDelete = async () => {
    if (!selectedTransaction) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', selectedTransaction.id);

      if (error) throw error;

      toast.success("Transaction deleted successfully");
      setShowDeleteDialog(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  const updateTransactionStatus = async (id: string, status: string, updates: any = {}) => {
    try {
      const { data: currentTransaction } = await supabase
        .from('transactions')
        .select('status, audit_trail')
        .eq('id', id)
        .single();

      const auditEntry = {
        action: `Status changed from ${currentTransaction.status} to ${status}`,
        timestamp: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('transactions')
        .update({ 
          status,
          previous_status: currentTransaction.status,
          audit_trail: [...(currentTransaction.audit_trail || []), auditEntry],
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  return {
    dialogState: {
      selectedTransaction,
      showPartialDialog,
      showPaymentSourceDialog,
      partialAmount,
      excuseReason,
      showExcuseDialog,
      newRepaymentDate,
      isDropdownOpen,
      showDeleteDialog,
    },
    handlers: {
      setSelectedTransaction,
      setShowPartialDialog,
      setShowPaymentSourceDialog,
      setPartialAmount,
      setExcuseReason,
      setShowExcuseDialog,
      setNewRepaymentDate,
      setIsDropdownOpen,
      setShowDeleteDialog,
      handleComplete,
      handlePartial,
      handleReschedule,
      handleReject,
      handleUndo,
      handleDelete,
      confirmDelete,
    },
  };
};