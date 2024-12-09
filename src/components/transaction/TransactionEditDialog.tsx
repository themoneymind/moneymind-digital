import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus, Minus, X } from "lucide-react";

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
  const [source, setSource] = useState(transaction.source);
  const [description, setDescription] = useState(transaction.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!source) {
      toast({
        title: "Error",
        description: "Please select a payment source",
        variant: "destructive",
      });
      return;
    }

    const numAmount = Number(amount);
    if (amount && !isNaN(numAmount)) {
      const finalAmount = operation === "add" 
        ? transaction.amount + numAmount 
        : transaction.amount - numAmount;

      editTransaction(transaction.id, {
        amount: finalAmount,
        source,
        description,
      });

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });

      setAmount("");
      onOpenChange(false);
    } else if (source !== transaction.source || description !== transaction.description) {
      editTransaction(transaction.id, {
        source,
        description,
      });

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });

      onOpenChange(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setAmount("");
    setSource(transaction.source);
    setDescription(transaction.description || "");
    onOpenChange(open);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent 
        className="sm:max-w-[425px] mx-4 relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 p-2.5 rounded-full hover:bg-red-50 transition-colors group"
        >
          <X className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
        </button>
        
        <DialogHeader className="space-y-3 mb-4">
          <DialogTitle className="text-xl">Edit Transaction</DialogTitle>
          <DialogDescription className="text-base font-medium">
            Current Amount: {formatCurrency(transaction.amount)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={operation === "add" ? "default" : "outline"}
              onClick={() => setOperation("add")}
              className="flex-1 h-12 gap-2 rounded-xl hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" />
              Add
            </Button>
            <Button
              type="button"
              variant={operation === "subtract" ? "default" : "outline"}
              onClick={() => setOperation("subtract")}
              className="flex-1 h-12 gap-2 rounded-xl hover:scale-105 transition-transform"
            >
              <Minus className="w-5 h-5" />
              Subtract
            </Button>
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 h-12 rounded-xl"
                placeholder="Enter amount to add/subtract"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="source" className="text-sm font-medium">
              Payment Source
            </label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select payment source" />
              </SelectTrigger>
              <SelectContent>
                {formattedSources.map((src) => (
                  <SelectItem key={src.id} value={src.id}>
                    {src.name}
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
              className="h-12 rounded-xl"
              placeholder="Add a note (optional)"
            />
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};