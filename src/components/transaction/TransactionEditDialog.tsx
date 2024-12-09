import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { TransactionAmountOperations } from "./TransactionAmountOperations";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount && !selectedSource) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const numAmount = Number(amount);
    if (operation === "subtract" && numAmount > transaction.amount) {
      toast({
        title: "Error",
        description: "Cannot subtract more than the current amount",
        variant: "destructive",
      });
      return;
    }

    const finalAmount = operation === "add" 
      ? transaction.amount + numAmount 
      : transaction.amount - numAmount;

    editTransaction(transaction.id, {
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <TransactionAmountOperations
            currentAmount={transaction.amount}
            operation={operation}
            setOperation={setOperation}
            amount={amount}
            setAmount={setAmount}
          />

          <div className="space-y-2">
            <label htmlFor="source" className="text-sm font-medium">
              Payment Source
            </label>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="h-12 rounded-[12px]">
                <SelectValue placeholder="Select payment source" />
              </SelectTrigger>
              <SelectContent>
                {formattedSources.map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 rounded-[12px]"
            />
          </div>

          <Button type="submit" className="w-full h-12 rounded-[12px]">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};