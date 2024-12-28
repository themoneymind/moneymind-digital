import { useFinance } from "@/contexts/FinanceContext";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DueTransaction } from "@/types/dues";
import { DuesStatusBadge } from "./DuesStatusBadge";
import { DuesActionButtons } from "./DuesActionButtons";
import { DuesPaymentSourceDialog } from "./DuesPaymentSourceDialog";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

export const DuesTransactionsList = () => {
  const { transactions, refreshData, addTransaction } = useFinance();
  const [selectedTransaction, setSelectedTransaction] = useState<DueTransaction | null>(null);
  const [showPartialDialog, setShowPartialDialog] = useState(false);
  const [showPaymentSourceDialog, setShowPaymentSourceDialog] = useState(false);
  const [partialAmount, setPartialAmount] = useState("");
  const [excuseReason, setExcuseReason] = useState("");
  const [showExcuseDialog, setShowExcuseDialog] = useState(false);
  const [newRepaymentDate, setNewRepaymentDate] = useState<Date>();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePaymentSourceSelect = async (sourceId: string) => {
    if (!selectedTransaction) return;

    try {
      const baseSourceId = getBaseSourceId(sourceId);
      console.log("Processing payment with source:", sourceId, "base:", baseSourceId);

      // Create the repayment transaction
      await addTransaction({
        type: selectedTransaction.type === 'expense' ? 'income' : 'expense',
        amount: selectedTransaction.remaining_balance || selectedTransaction.amount,
        category: "Dues Repayment",
        source: baseSourceId,
        description: `Repayment for: ${selectedTransaction.description}`,
        reference_type: "due_repayment",
        reference_id: selectedTransaction.id,
      });

      // Update the due transaction status
      await updateTransactionStatus(selectedTransaction.id, 'completed', {
        remaining_balance: 0
      });

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

      // Create the partial repayment transaction
      await addTransaction({
        type: selectedTransaction.type === 'expense' ? 'income' : 'expense',
        amount: amount,
        category: "Dues Partial Repayment",
        source: baseSourceId,
        description: `Partial repayment for: ${selectedTransaction.description}`,
        reference_type: "due_repayment",
        reference_id: selectedTransaction.id,
      });

      // Update the due transaction status
      await updateTransactionStatus(selectedTransaction.id, 'partially_paid', {
        remaining_balance: (selectedTransaction.remaining_balance || selectedTransaction.amount) - amount
      });

      setShowPartialDialog(false);
      setPartialAmount("");
      toast.success("Partial payment processed successfully");
    } catch (error) {
      console.error("Error processing partial payment:", error);
      toast.error("Failed to process partial payment");
    }
  };

  const updateTransactionStatus = async (id: string, status: string, updates: any = {}) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status,
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

  const handleComplete = async (transaction: DueTransaction) => {
    setSelectedTransaction(transaction);
    setShowPaymentSourceDialog(true);
  };

  const handlePartial = (transaction: DueTransaction) => {
    setSelectedTransaction(transaction);
    setShowPartialDialog(true);
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

  const handleReject = async (id: string) => {
    await updateTransactionStatus(id, 'rejected');
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
            <div 
              key={transaction.id}
              className="bg-white p-4 rounded-[12px] border border-gray-200 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{format(new Date(transaction.date), 'PPP')}</span>
                    {transaction.repayment_date && (
                      <>
                        <span>•</span>
                        <span>Due: {format(new Date(transaction.repayment_date), 'PPP')}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(Number(transaction.amount))}
                  </p>
                  <DuesStatusBadge transaction={transaction} />
                </div>
              </div>
              
              {transaction.excuse_reason && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  Reason: {transaction.excuse_reason}
                </p>
              )}

              <DuesActionButtons
                transaction={transaction}
                onComplete={handleComplete}  // This now matches the expected type
                onPartial={handlePartial}
                onReschedule={(t) => {
                  setSelectedTransaction(t);
                  setShowExcuseDialog(true);
                }}
                onReject={handleReject}
              />
            </div>
          ))
        )}
      </div>

      {/* Partial Payment Dialog */}
      <Dialog open={showPartialDialog} onOpenChange={setShowPartialDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Partial Payment Amount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <Input
                type="number"
                placeholder="0"
                className="pl-8"
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
              />
            </div>
            <Button 
              className="w-full"
              onClick={() => {
                if (selectedTransaction) {
                  setShowPaymentSourceDialog(true);
                }
              }}
              disabled={!partialAmount}
            >
              Select Payment Source
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Source Dialog */}
      <DuesPaymentSourceDialog
        isOpen={showPaymentSourceDialog}
        onClose={() => {
          setShowPaymentSourceDialog(false);
          setShowPartialDialog(false);
          setSelectedTransaction(null);
        }}
        onConfirm={partialAmount ? handlePartialPaymentSourceSelect : handlePaymentSourceSelect}
        title={`Select ${selectedTransaction?.type === 'expense' ? 'Repayment' : 'Payment'} Source`}
      />

      {/* Excuse Dialog */}
      <Dialog open={showExcuseDialog} onOpenChange={setShowExcuseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <Input
              placeholder="Reason for rescheduling"
              value={excuseReason}
              onChange={(e) => setExcuseReason(e.target.value)}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newRepaymentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newRepaymentDate ? format(newRepaymentDate, "PPP") : "Select new date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newRepaymentDate}
                  onSelect={setNewRepaymentDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <Button 
              className="w-full"
              onClick={handleExcuseSubmit}
            >
              Confirm Reschedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};