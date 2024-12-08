import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    const source = formData.get("source") as string;
    const description = formData.get("description") as string;

    if (!amount || !source) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    editTransaction(transaction.id, {
      amount,
      source,
      description,
    });

    toast({
      title: "Success",
      description: "Transaction updated successfully",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                name="amount"
                type="number"
                defaultValue={transaction.amount}
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="source" className="text-sm font-medium">
              Payment Source
            </label>
            <Select name="source" defaultValue={transaction.source}>
              <SelectTrigger>
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
              name="description"
              defaultValue={transaction.description}
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};