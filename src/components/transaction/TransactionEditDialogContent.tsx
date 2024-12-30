import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionEditDialogForm } from "./TransactionEditDialogForm";
import { Transaction } from "@/types/transactions";
import { useFinance } from "@/contexts/FinanceContext";
import { useTransactionEditForm } from "@/hooks/useTransactionEditForm";

interface TransactionEditDialogContentProps {
  transaction: Transaction;
  onOpenChange: (open: boolean) => void;
}

export const TransactionEditDialogContent = ({
  transaction,
  onOpenChange,
}: TransactionEditDialogContentProps) => {
  const { getFormattedPaymentSources } = useFinance();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const formattedSources = getFormattedPaymentSources();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleSubmit(e);
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
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          description={description}
          setDescription={setDescription}
          formattedSources={formattedSources}
          onDropdownOpenChange={() => {}}
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