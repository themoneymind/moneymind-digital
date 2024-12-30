import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DueTransaction } from "@/types/dues";
import { toast } from "sonner";
import { cleanSourceId, createAuditEntry } from "@/utils/duesUtils";
import { useFinance } from "@/contexts/FinanceContext";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

export const useDuesOperations = (refreshData: () => Promise<void>) => {
  const { addTransaction } = useFinance();
  const [selectedTransaction, setSelectedTransaction] = useState<DueTransaction | null>(null);
  const [showPartialDialog, setShowPartialDialog] = useState(false);
  const [showPaymentSourceDialog, setShowPaymentSourceDialog] = useState(false);
  const [showExcuseDialog, setShowExcuseDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");
  const [excuseReason, setExcuseReason] = useState("");
  const [newRepaymentDate, setNewRepaymentDate] = useState<Date>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const updateTransactionStatus = async (id: string, status: string, updates: any = {}) => {
    try {
      const { data: currentTransaction } = await supabase
        .from('transactions')
        .select('status, audit_trail')
        .eq('id', id)
        .single();

      const auditEntry = createAuditEntry(currentTransaction.status, status);

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

      await refreshData();
      
      if (status === 'rejected') {
        toast.success("Transaction has been rejected");
      } else {
        toast.success(`Due marked as ${status}`);
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
      toast.error("Failed to update status");
    }
  };

  const handlePaymentSourceSelect = async (sourceId: string) => {
    if (!selectedTransaction) return;

    try {
      const baseSourceId = getBaseSourceId(sourceId);
      console.log("Processing payment with source:", sourceId, "cleaned:", baseSourceId);

      await addTransaction({
        type: selectedTransaction.type === 'expense' ? 'income' : 'expense',
        amount: selectedTransaction.remaining_balance || selectedTransaction.amount,
        category: "Dues Repayment",
        source: sourceId,
        description: `Repayment for: ${selectedTransaction.description}`,
        reference_type: "due_repayment",
        reference_id: selectedTransaction.id,
        base_source_id: baseSourceId,
        display_source: sourceId,
      });

      await updateTransactionStatus(selectedTransaction.id, 'completed', {
        remaining_balance: 0
      });

      setShowPaymentSourceDialog(false);
      setSelectedTransaction(null);
      toast.success("Payment completed successfully");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
    }
  };

  const handlePartialPaymentSourceSelect = async (sourceId: string) => {
    if (!selectedTransaction || !partialAmount) return;

    const amount = Number(partialAmount);
    if (isNaN(amount) || amount <= 0 || amount >= (selectedTransaction.remaining_balance || selectedTransaction.amount)) {
      toast.error("Please enter a valid partial amount");
      return;
    }

    try {
      const baseSourceId = getBaseSourceId(sourceId);
      console.log("Processing partial payment with source:", sourceId, "cleaned:", baseSourceId);

      await addTransaction({
        type: selectedTransaction.type === 'expense' ? 'income' : 'expense',
        amount: amount,
        category: "Dues Partial Repayment",
        source: sourceId,
        description: `Partial repayment for: ${selectedTransaction.description}`,
        reference_type: "due_repayment",
        reference_id: selectedTransaction.id,
        base_source_id: baseSourceId,
        display_source: sourceId,
      });

      await updateTransactionStatus(selectedTransaction.id, 'partially_paid', {
        remaining_balance: (selectedTransaction.remaining_balance || selectedTransaction.amount) - amount
      });

      setShowPartialDialog(false);
      setPartialAmount("");
      setShowPaymentSourceDialog(false);
      setSelectedTransaction(null);
      toast.success("Partial payment processed successfully");
    } catch (error) {
      console.error("Error processing partial payment:", error);
      toast.error("Failed to process partial payment");
    }
  };

  return {
    selectedTransaction,
    setSelectedTransaction,
    showPartialDialog,
    setShowPartialDialog,
    showPaymentSourceDialog,
    setShowPaymentSourceDialog,
    showExcuseDialog,
    setShowExcuseDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    partialAmount,
    setPartialAmount,
    excuseReason,
    setExcuseReason,
    newRepaymentDate,
    setNewRepaymentDate,
    isDropdownOpen,
    setIsDropdownOpen,
    updateTransactionStatus,
    handlePaymentSourceSelect,
    handlePartialPaymentSourceSelect,
  };
};
