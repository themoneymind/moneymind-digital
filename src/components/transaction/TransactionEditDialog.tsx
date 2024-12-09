import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { Transaction } from "@/types/finance";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { TransactionAmountOperations } from "./TransactionAmountOperations";
import { extractBaseSourceId } from "@/utils/transactionUtils";

interface TransactionEditDialogProps {
  transaction: Transaction;
}

export const TransactionEditDialog = ({
  transaction,
}: TransactionEditDialogProps) => {
  const { editTransaction } = useFinance();
  const [open, setOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(transaction.source);
  const [description, setDescription] = useState(transaction.description || "");
  const [numAmount, setNumAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSource) {
      return;
    }

    const finalAmount =
      transaction.type === "income"
        ? transaction.amount + Number(numAmount)
        : transaction.amount - Number(numAmount);

    const baseSourceId = extractBaseSourceId(selectedSource);

    editTransaction(transaction.id, {
      amount: finalAmount,
      source: baseSourceId,
      description,
    });

    // Reset form
    setNumAmount("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-gray-100"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <TransactionAmountOperations
            amount={numAmount}
            setAmount={setNumAmount}
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