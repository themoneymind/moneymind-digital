import { useFinance } from "@/contexts/FinanceContext";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  Percent, 
  Edit2, 
  Calendar,
  AlertCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const DuesTransactionsList = () => {
  const { transactions, refreshData } = useFinance();
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showPartialDialog, setShowPartialDialog] = useState(false);
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

  const handleComplete = async (id: string) => {
    await updateTransactionStatus(id, 'completed', {
      remaining_balance: 0
    });
  };

  const handlePartialSubmit = async () => {
    if (!selectedTransaction || !partialAmount) return;

    const amount = Number(partialAmount);
    if (isNaN(amount) || amount <= 0 || amount >= selectedTransaction.remaining_balance) {
      toast.error("Please enter a valid partial amount");
      return;
    }

    await updateTransactionStatus(selectedTransaction.id, 'partially_paid', {
      remaining_balance: selectedTransaction.remaining_balance - amount
    });

    setShowPartialDialog(false);
    setPartialAmount("");
    setSelectedTransaction(null);
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

  const getStatusBadge = (transaction: any) => {
    const status = transaction.status || 'pending';
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'partially_paid':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Percent className="w-3 h-3 mr-1" />
            Partially Paid ({formatCurrency(transaction.remaining_balance)} remaining)
          </Badge>
        );
      case 'payment_scheduled':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Calendar className="w-3 h-3 mr-1" />
            Scheduled ({format(new Date(transaction.repayment_date), 'PP')})
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  // Filter only due transactions
  const dueTransactions = transactions.filter(
    transaction => transaction.reference_type === 'due'
  );

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
                  {getStatusBadge(transaction)}
                </div>
              </div>
              
              {transaction.excuse_reason && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  Reason: {transaction.excuse_reason}
                </p>
              )}

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleComplete(transaction.id)}
                  disabled={transaction.status === 'completed'}
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Complete
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setShowPartialDialog(true);
                  }}
                  disabled={transaction.status === 'completed'}
                >
                  <Percent className="w-4 h-4 text-yellow-600" />
                  Partial
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setShowExcuseDialog(true);
                  }}
                  disabled={transaction.status === 'completed'}
                >
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Reschedule
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleReject(transaction.id)}
                  disabled={transaction.status === 'rejected'}
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  Reject
                </Button>
              </div>
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
              onClick={handlePartialSubmit}
            >
              Confirm Partial Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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