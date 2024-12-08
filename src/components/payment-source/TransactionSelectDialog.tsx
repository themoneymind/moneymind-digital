import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type TransactionSelectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceId: string;
  amountToSubtract: number;
  onTransactionSelect: (transactionId: string) => void;
};

export const TransactionSelectDialog = ({
  open,
  onOpenChange,
  sourceId,
  amountToSubtract,
  onTransactionSelect,
}: TransactionSelectDialogProps) => {
  const { getTransactionsBySource } = useFinance();
  const transactions = getTransactionsBySource(sourceId).filter(t => t.type === 'expense');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSelect = (transactionId: string) => {
    onTransactionSelect(transactionId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Transaction to Update</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={transaction.id}
                  id={transaction.id}
                  onClick={() => handleSelect(transaction.id)}
                />
                <Label htmlFor={transaction.id} className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{transaction.category}</p>
                      <p className="text-sm text-gray-500">
                        {format(transaction.date, "MMM d, h:mm a")}
                      </p>
                    </div>
                    <p className="text-red-500 font-medium">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
};