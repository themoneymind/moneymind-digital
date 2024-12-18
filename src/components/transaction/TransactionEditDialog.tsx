import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useFinance } from "@/contexts/FinanceContext";
import { useEffect, useState } from "react";
import { Transaction } from "@/types/transactions";
import { useToast } from "@/hooks/use-toast";
import { useTransactionEditForm } from "@/hooks/useTransactionEditForm";
import { useDialogState } from "@/hooks/useDialogState";
import { TransactionEditDialogContent } from "./TransactionEditDialogContent";

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
  const formattedSources = getFormattedPaymentSources();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    isClosing,
    isSubmitting,
    handleOpenChange,
    startSubmitting,
    stopSubmitting,
    initiateClose,
    reset,
  } = useDialogState(onOpenChange);

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
    toast({
      title: "Success",
      description: "Transaction updated successfully",
    });
    initiateClose();
  });

  useEffect(() => {
    if (open) {
      resetForm();
      reset();
      setIsDropdownOpen(false);
    }
  }, [open, resetForm, reset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    startSubmitting();
    try {
      await onSubmit(e);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update transaction",
        variant: "destructive",
      });
      stopSubmitting();
    }
  };

  const handleEscapeKeyDown = (e: React.KeyboardEvent) => {
    if (isSubmitting) {
      e.preventDefault();
      return;
    }

    if (isDropdownOpen) {
      e.preventDefault();
      setIsDropdownOpen(false);
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => {
          if (isSubmitting || isDropdownOpen) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={handleEscapeKeyDown}
      >
        <TransactionEditDialogContent
          transaction={transaction}
          operation={operation}
          setOperation={setOperation}
          amount={amount}
          setAmount={setAmount}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          description={description}
          setDescription={setDescription}
          formattedSources={formattedSources}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onDropdownOpenChange={setIsDropdownOpen}
        />
      </DialogContent>
    </Dialog>
  );
};