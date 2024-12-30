import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionEditDialogForm } from "./TransactionEditDialogForm";
import { Transaction } from "@/types/transactions";
import { useFinance } from "@/contexts/FinanceContext";
import { useTransactionEditForm } from "@/hooks/useTransactionEditForm";

export interface TransactionEditDialogContentProps {
  transaction: Transaction;
  onOpenChange: (open: boolean) => void;
}

export const TransactionEditDialogContent = ({
  transaction,
  onOpenChange,
}: TransactionEditDialogContentProps) => {
  const { getFormattedPaymentSources } = useFinance();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(transaction.date));
  
  // Extract UPI app from display source if present
  const getInitialSource = () => {
    if (!transaction.display_source) return transaction.source;
    
    const formattedSources = getFormattedPaymentSources();
    // Try to find a matching source based on display name
    const matchingSource = formattedSources.find(s => s.name === transaction.display_source);
    return matchingSource ? matchingSource.id : transaction.source;
  };

  const {
    operation,
    setOperation,
    amount,
    setAmount,
    selectedSource,
    setSelectedSource,
    description,
    setDescription,
    handleSubmit,
  } = useTransactionEditForm(transaction, () => {
    onOpenChange(false);
  });

  console.log("TransactionEditDialogContent - Original transaction:", {
    source: transaction.source,
    display_source: transaction.display_source,
    base_source_id: transaction.base_source_id,
    initialSource: getInitialSource()
  });

  const formattedSources = getFormattedPaymentSources();
  console.log("TransactionEditDialogContent - Available sources:", formattedSources);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleSubmit(e, {
        date: selectedDate,
        display_source: transaction.display_source
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Edit Transaction</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <TransactionEditDialogForm
          currentAmount={Number(transaction.amount)}
          operation={operation}
          setOperation={setOperation}
          amount={amount}
          setAmount={setAmount}
          selectedSource={getInitialSource()}
          setSelectedSource={setSelectedSource}
          description={description}
          setDescription={setDescription}
          formattedSources={formattedSources}
          onDropdownOpenChange={() => {}}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          repeatFrequency={transaction.repeat_frequency || "never"}
          onRepeatChange={(frequency) => {
            // Handle repeat frequency change if needed
          }}
        />
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="flex-1 h-12 rounded-[12px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </>
  );
};