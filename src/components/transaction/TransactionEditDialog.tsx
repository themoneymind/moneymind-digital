import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/contexts/FinanceContext";
import { Transaction } from "@/types/finance";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { TransactionAmountOperations } from "./TransactionAmountOperations";
import { extractBaseSourceId } from "@/utils/transactionUtils";

interface TransactionEditDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransactionEditDialog = ({
  transaction,
  open,
  onOpenChange,
}: TransactionEditDialogProps) => {
  const { editTransaction } = useFinance();
  const [selectedSource, setSelectedSource] = useState(transaction.source);
  const [description, setDescription] = useState(transaction.description || "");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSource) {
      return;
    }

    const baseSourceId = extractBaseSourceId(selectedSource);

    editTransaction(transaction.id, {
      amount: Number(amount),
      source: baseSourceId,
      description,
    });

    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <TransactionAmountOperations
            amount={amount}
            setAmount={setAmount}
          />
          <PaymentSourceSelector
            value={selectedSource}
            onChange={setSelectedSource}
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Update Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};