import { useFinance } from "@/contexts/FinanceContext";
import { supabase } from "@/integrations/supabase/client";
import { DueTransaction } from "@/types/dues";
import { toast } from "sonner";
import { DuesTransactionItem } from "./DuesTransactionItem";
import { DuesDialogs } from "./DuesDialogs";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useDuesOperations } from "@/hooks/useDuesOperations";
import { formatDuesCurrency } from "@/utils/duesUtils";

export const DuesTransactionsList = () => {
  const { transactions, refreshData } = useFinance();
  const {
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
  } = useDuesOperations(refreshData);

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

  const handleDelete = async (transaction: DueTransaction) => {
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

      await refreshData();
      toast.success("Transaction deleted successfully");
      setShowDeleteDialog(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  // Filter only active due transactions (not rejected)
  const dueTransactions = transactions.filter(
    transaction => transaction.reference_type === 'due' && transaction.status !== 'rejected'
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
              onDelete={handleDelete}
              formatCurrency={formatDuesCurrency}
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
        setSelectedTransaction={setSelectedTransaction}
        handleExcuseSubmit={handleExcuseSubmit}
        handlePaymentSourceSelect={handlePaymentSourceSelect}
        handlePartialPaymentSourceSelect={handlePartialPaymentSourceSelect}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedTransaction(null);
        }}
        onConfirm={confirmDelete}
        amount={selectedTransaction?.amount || 0}
      />
    </div>
  );
};