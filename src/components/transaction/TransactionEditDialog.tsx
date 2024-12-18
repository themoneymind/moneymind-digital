import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { useState, useEffect, useCallback } from "react";
import { TransactionEditDialogForm } from "./TransactionEditDialogForm";
import { useTransactionEditForm } from "@/hooks/useTransactionEditForm";
import { Transaction } from "@/types/transactions";
import { useToast } from "@/hooks/use-toast";

type TransactionEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
};

export const TransactionEditDialog = ({
  open,
  onOpenChange,
  transaction,
}: TransactionEditDialogProps) => {
  const { getFormattedPaymentSources } = useFinance();
  const { toast } = useToast();
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formattedSources = getFormattedPaymentSources();

  const {
    operation,
    setOperation,
    amount,
    setAmount,
    selectedSource,
    setSelectedSource,
    description,
    setDescription,
    handleSubmit: onSubmit,
    resetForm,
  } = useTransactionEditForm(transaction, () => {
    setIsClosing(true);
    onOpenChange(false);
  });

  useEffect(() => {
    if (open) {
      resetForm();
      setIsClosing(false);
      setIsSubmitting(false);
    }
  }, [open, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(e);
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update transaction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen && !isSubmitting && !isClosing) {
      setIsClosing(true);
      onOpenChange(false);
    }
  }, [isSubmitting, isClosing, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <TransactionEditDialogForm
            currentAmount={transaction.amount}
            operation={operation}
            setOperation={setOperation}
            amount={amount}
            setAmount={setAmount}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            description={description}
            setDescription={setDescription}
            formattedSources={formattedSources}
          />
          <Button 
            type="submit" 
            className="w-full h-12 rounded-[12px] mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};