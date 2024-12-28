import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useFinance } from "@/contexts/FinanceContext";
import { DueTransaction } from "@/types/dues";
import { useAuth } from "@/contexts/AuthContext";

export const useTransactionOperations = () => {
  const { refreshData } = useFinance();
  const { user } = useAuth();
  const [selectedTransaction, setSelectedTransaction] = useState<DueTransaction | null>(null);
  const [showPaymentSourceDialog, setShowPaymentSourceDialog] = useState(false);
  const [showPartialDialog, setShowPartialDialog] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");
  const [excuseReason, setExcuseReason] = useState("");
  const [showExcuseDialog, setShowExcuseDialog] = useState(false);
  const [newRepaymentDate, setNewRepaymentDate] = useState<Date>();

  const getBaseSourceId = (sourceId: string) => {
    return sourceId.split('-')[0];
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
      await refreshData();
    } catch (error) {
      console.error("Error updating transaction status:", error);
      throw error;
    }
  };

  const handlePaymentSource = async (sourceId: string) => {
    if (!selectedTransaction || !user) return;

    try {
      const baseSourceId = getBaseSourceId(sourceId);
      console.log("Processing payment with source:", sourceId, "base:", baseSourceId);

      await supabase.from("transactions").insert({
        type: selectedTransaction.type === 'expense' ? 'income' : 'expense',
        amount: selectedTransaction.remaining_balance || selectedTransaction.amount,
        category: "Dues Repayment",
        source: baseSourceId,
        description: `Repayment for: ${selectedTransaction.description}`,
        reference_type: "due_repayment",
        reference_id: selectedTransaction.id,
        user_id: user.id,
      });

      await updateTransactionStatus(selectedTransaction.id, 'completed', {
        remaining_balance: 0
      });

      setShowPaymentSourceDialog(false);
      setSelectedTransaction(null);
      toast.success("Payment completed successfully");
      await refreshData();
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
    }
  };

  const handlePartialPayment = async (sourceId: string) => {
    if (!selectedTransaction || !partialAmount || !user) return;

    const amount = Number(partialAmount);
    if (isNaN(amount) || amount <= 0 || amount >= (selectedTransaction.remaining_balance || selectedTransaction.amount)) {
      toast.error("Please enter a valid partial amount");
      return;
    }

    try {
      const baseSourceId = getBaseSourceId(sourceId);
      console.log("Processing partial payment with source:", sourceId, "base:", baseSourceId);

      await supabase.from("transactions").insert({
        type: selectedTransaction.type === 'expense' ? 'income' : 'expense',
        amount: amount,
        category: "Dues Partial Repayment",
        source: baseSourceId,
        description: `Partial repayment for: ${selectedTransaction.description}`,
        reference_type: "due_repayment",
        reference_id: selectedTransaction.id,
        user_id: user.id,
      });

      await updateTransactionStatus(selectedTransaction.id, 'partially_paid', {
        remaining_balance: (selectedTransaction.remaining_balance || selectedTransaction.amount) - amount
      });

      setShowPartialDialog(false);
      setPartialAmount("");
      setShowPaymentSourceDialog(false);
      setSelectedTransaction(null);
      toast.success("Partial payment processed successfully");
      await refreshData();
    } catch (error) {
      console.error("Error processing partial payment:", error);
      toast.error("Failed to process partial payment");
    }
  };

  const handleExcuse = async () => {
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
    toast.success("Payment rescheduled successfully");
    await refreshData();
  };

  return {
    selectedTransaction,
    setSelectedTransaction,
    showPaymentSourceDialog,
    setShowPaymentSourceDialog,
    showPartialDialog,
    setShowPartialDialog,
    partialAmount,
    setPartialAmount,
    excuseReason,
    setExcuseReason,
    showExcuseDialog,
    setShowExcuseDialog,
    newRepaymentDate,
    setNewRepaymentDate,
    handlePaymentSource,
    handlePartialPayment,
    handleExcuse,
  };
};