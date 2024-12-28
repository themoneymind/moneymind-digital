import { useFinance } from "@/contexts/FinanceContext";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DueTransaction } from "@/types/dues";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";
import { DuesTransactionItem } from "./DuesTransactionItem";
import { DuesDialogs } from "./DuesDialogs";

export const DuesTransactionsList = () => {
  const { transactions, refreshData, addTransaction } = useFinance();
  const [selectedTransaction, setSelectedTransaction] = useState<DueTransaction | null>(null);
  const [showPartialDialog, setShowPartialDialog] = useState(false);
  const [showPaymentSourceDialog, setShowPaymentSourceDialog] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");
  const [excuseReason, setExcuseReason] = useState("");
  const [showExcuseDialog, setShowExcuseDialog] = useState(false);
  const [newRepaymentDate, setNewRepaymentDate] = useState<Date>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
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
      toast.success(`Due marked as ${status}`);
    } catch (error) {
      console.error("Error updating transaction status:", error);
      toast.error("Failed to update status");
    }
  };

  const handlePaymentSourceSelect = async (sourceId: string) => {
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

  const handlePartialPaymentSourceSelect = async (sourceId: string) => {
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

      // Restore the original transaction status
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

  // Filter only due transactions
  const dueTransactions = transactions.filter(
    transaction => transaction.reference_type === 'due'
  ) as DueTransaction[];

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-base font-semibold">Due Transactions</h3>
      <div className="space-y-3">
        {dueTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No due transactions yet
          </div>
        ) : (
          dueTransactions.map((transaction) => (
            <DuesTransactionItem
              key={transaction.id}
              transaction={transaction}
              onComplete={(t) => {
                setSelectedTransaction(t);
                setShowPaymentSourceDialog(true);
              }}
              onPartial={(t) => {
                setSelectedTransaction(t);
                setShowPartialDialog(true);
              }}
              onReschedule={(t) => {
                setSelectedTransaction(t);
                setShowExcuseDialog(true);
              }}
              onReject={(id) => updateTransactionStatus(id, 'rejected')}
              onUndo={handleUndo}
              formatCurrency={formatCurrency}
            />
          ))
        )}
      </div>

      <DuesDialogs
        showPartialDialog={showPartialDialog}
        setShowPartialDialog={setShowPartialDialog}
        showPaymentSourceDialog={showPaymentSourceDialog}
        setShowPaymentSourceDialog={setShowPaymentSourceDialog}
        showExcuseDialog={showExcuseDialog}
        setShowExcuseDialog={setShowExcuseDialog}
        partialAmount={partialAmount}
        setPartialAmount={setPartialAmount}
        excuseReason={excuseReason}
        setExcuseReason={setExcuseReason}
        newRepaymentDate={newRepaymentDate}
        setNewRepaymentDate={setNewRepaymentDate}
        selectedTransaction={selectedTransaction}
        handleExcuseSubmit={handleExcuseSubmit}
        handlePaymentSourceSelect={handlePaymentSourceSelect}
        handlePartialPaymentSourceSelect={handlePartialPaymentSourceSelect}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />
    </div>
  );
};