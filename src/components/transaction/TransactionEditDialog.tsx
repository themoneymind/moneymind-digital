import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { useState, useEffect } from "react";
import { TransactionEditDialogForm } from "./TransactionEditDialogForm";
import { useTransactionEditForm } from "@/hooks/useTransactionEditForm";
import { Transaction } from "@/types/transactions";

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
  const [isClosing, setIsClosing] = useState(false);
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
    isSubmitting,
    handleSubmit,
    resetForm,
  } = useTransactionEditForm(transaction, () => {
    setIsClosing(true);
    onOpenChange(false);
  });

  useEffect(() => {
    if (open) {
      resetForm();
      setIsClosing(false);
    }
  }, [open, resetForm]);

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!newOpen && !isSubmitting) {
          setIsClosing(true);
          onOpenChange(false);
        }
      }}
    >
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