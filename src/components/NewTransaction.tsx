import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionTypeSelector } from "./transaction/TransactionTypeSelector";
import { CategorySelector } from "./transaction/CategorySelector";
import { PaymentSourceSelector } from "./transaction/PaymentSourceSelector";
import { TransactionAmountOperations } from "./transaction/TransactionAmountOperations";
import { extractBaseSourceId } from "@/utils/transactionUtils";

export const NewTransaction = () => {
  const { addTransaction } = useFinance();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category || !source) {
      return;
    }

    const baseSourceId = extractBaseSourceId(source);

    addTransaction({
      type,
      amount: Number(amount),
      category,
      source: baseSourceId,
      description,
    });

    // Reset form
    setAmount("");
    setCategory("");
    setSource("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="fixed bottom-20 right-4 z-50 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <TransactionTypeSelector value={type} onChange={setType} />
          <TransactionAmountOperations
            amount={amount}
            setAmount={setAmount}
          />
          <CategorySelector value={category} onChange={setCategory} />
          <PaymentSourceSelector value={source} onChange={setSource} />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Add Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};