import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useFinance } from "@/contexts/FinanceContext";
import { useState, useEffect } from "react";
import { Transaction } from "@/types/transactions";
import { useToast } from "@/hooks/use-toast";
import { useTransactionEditForm } from "@/hooks/useTransactionEditForm";
import { TransactionEditDialogContent } from "./TransactionEditDialogContent";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(transaction.amount);

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
    handleClose();
  });

  useEffect(() => {
    if (open) {
      resetForm();
      setIsSubmitting(false);
      setIsDropdownOpen(false);
      setCurrentAmount(transaction.amount);
    }
  }, [open, resetForm, transaction.amount]);

  useEffect(() => {
    const numAmount = Number(amount);
    if (!isNaN(numAmount)) {
      setCurrentAmount(operation === "add" ? transaction.amount + numAmount : transaction.amount - numAmount);
    } else {
      setCurrentAmount(transaction.amount);
    }
  }, [amount, operation, transaction.amount]);

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update transaction",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    // Handle delete logic here
    setIsAlertOpen(false);
    handleClose();
  };

  return (
    <>
      <Dialog 
        open={open} 
        onOpenChange={(newOpen) => {
          if (!newOpen && !isSubmitting && !isDropdownOpen) {
            handleClose();
          }
        }}
      >
        <DialogContent 
          className="sm:max-w-[425px]"
          onPointerDownOutside={(e) => {
            if (isSubmitting || isDropdownOpen) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (isSubmitting || isDropdownOpen) {
              e.preventDefault();
              if (isDropdownOpen) {
                setIsDropdownOpen(false);
              }
            }
          }}
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
            currentAmount={currentAmount}
          />
          <div className="mt-4 flex justify-end">
            <Button 
              variant="destructive"
              onClick={() => setIsAlertOpen(true)}
              className="mr-2"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};