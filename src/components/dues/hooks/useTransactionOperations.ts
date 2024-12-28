import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useFinance } from "@/contexts/FinanceContext";

export const useTransactionOperations = () => {
  const { refreshData, addTransaction } = useFinance();

  const handlePaymentSource = async (sourceId: string) => {
    if (!selectedTransaction) return;

    try {
      const baseSourceId = getBaseSourceId(sourceId);
      console.log("Processing payment with source:", sourceId, "base:", baseSourceId);

      await addTransaction({
        type: selectedTransaction.type === 'expense' ? 'income' : 'expense',
        amount: selectedTransaction.remaining_balance || selectedTransaction.amount,
        category: "Dues Repayment",
        source: baseSourceId,
        description: `Repayment for: ${selectedTransaction.description}`,
        reference_type: "due_repayment",
        reference_id: selectedTransaction.id,
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

  const handlePartialPayment = async (sourceId: string) => {
    if (!selectedTransaction || !partialAmount) return;

    const amount = Number(partialAmount);
    if (isNaN(amount) || amount <= 0 || amount >= (selectedTransaction.remaining_balance || selectedTransaction.amount)) {
      toast.error("Please enter a valid partial amount");
      return;
    }

    try {
      const baseSourceId = getBaseSourceId(sourceId);
      console.log("Processing partial payment with source:", sourceId, "base:", baseSourceId);

      await addTransaction({
        type: selectedTransaction.type === 'expense' ? 'income' : 'expense',
        amount: amount,
        category: "Dues Partial Repayment",
        source: baseSourceId,
        description: `Partial repayment for: ${selectedTransaction.description}`,
        reference_type: "due_repayment",
        reference_id: selectedTransaction.id,
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
  };

  return {
    handlePaymentSource,
    handlePartialPayment,
    handleExcuse,
  };
};