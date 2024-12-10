import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { TransactionEditDialogForm } from "./TransactionEditDialogForm";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  source: string;
  description?: string;
  date: Date;
};

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
  const { editTransaction, getFormattedPaymentSources } = useFinance();
  const { toast } = useToast();
  const formattedSources = getFormattedPaymentSources();
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [amount, setAmount] = useState("");
  const [selectedSource, setSelectedSource] = useState(transaction.source);
  const [description, setDescription] = useState(transaction.description || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSource) {
      toast({
        title: "Error",
        description: "Please select a payment source",
        variant: "destructive",
      });
      return;
    }

    const numAmount = Number(amount);
    if (amount && isNaN(numAmount)) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const finalAmount = amount 
      ? (operation === "add" 
          ? transaction.amount + numAmount 
          : transaction.amount - numAmount)
      : transaction.amount;

    try {
      await editTransaction(transaction.id, {
        amount: finalAmount,
        source: selectedSource,
        description,
      });

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });

      setAmount("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setAmount("");
      setOperation("add");
      setDescription(transaction.description || "");
      setSelectedSource(transaction.source);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
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
          <Button type="submit" className="w-full h-12 rounded-[12px] mt-6">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};