import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useFinance } from "@/contexts/FinanceContext";
import { useState, useEffect } from "react";
import { Transaction, RepeatOption } from "@/types/transactions";
import { useToast } from "@/hooks/use-toast";
import { useTransactionEditForm } from "@/hooks/useTransactionEditForm";
import { TransactionEditDialogContent } from "./TransactionEditDialogContent";
import { useDialogState } from "@/hooks/useDialogState";

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
  const { getFormattedPaymentSources, deleteTransaction } = useFinance();
  const { toast } = useToast();
  const formattedSources = getFormattedPaymentSources();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(transaction.amount);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(transaction.date));
  const [repeatOption, setRepeatOption] = useState<RepeatOption>(transaction.repeat_frequency || "never");
  const dialogState = useDialogState(onOpenChange);

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
    dialogState.initiateClose();
  });

  useEffect(() => {
    if (open) {
      resetForm();
      dialogState.reset();
      setIsDropdownOpen(false);
      setCurrentAmount(transaction.amount);
      setSelectedDate(new Date(transaction.date));
      setRepeatOption(transaction.repeat_frequency || "never");
    }
  }, [open, resetForm, transaction]);

  useEffect(() => {
    const numAmount = Number(amount);
    if (!isNaN(numAmount)) {
      if (operation === "add") {
        setCurrentAmount(transaction.amount + numAmount);
      } else {
        setCurrentAmount(transaction.amount - numAmount);
      }
    } else {
      setCurrentAmount(transaction.amount);
    }
  }, [amount, operation, transaction.amount]);

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      dialogState.initiateClose();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with date:", selectedDate);
    
    // Create a new transaction object with the updated date
    const updatedTransaction = {
      ...transaction,
      date: selectedDate,
    };
    
    await onSubmit(e, updatedTransaction);
  };

  const handleDateChange = (newDate: Date) => {
    console.log("Date changed to:", newDate);
    setSelectedDate(newDate);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!newOpen && !dialogState.isSubmitting && !dialogState.isClosing) {
          dialogState.initiateClose();
          onOpenChange(false);
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => {
          if (dialogState.isSubmitting || dialogState.isClosing || isDropdownOpen) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (dialogState.isSubmitting || dialogState.isClosing || isDropdownOpen) {
            e.preventDefault();
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
          isSubmitting={dialogState.isSubmitting}
          onDropdownOpenChange={setIsDropdownOpen}
          currentAmount={currentAmount}
          onDelete={handleDelete}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          repeatOption={repeatOption}
          onRepeatOptionChange={setRepeatOption}
        />
      </DialogContent>
    </Dialog>
  );
};