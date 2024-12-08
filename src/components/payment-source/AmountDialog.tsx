import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";

type AmountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: {
    id: string;
    name: string;
    type: string;
    amount: number;
    linked?: boolean;
    upiApps?: string[];
  };
  operation: "add" | "subtract";
};

export const AmountDialog = ({
  open,
  onOpenChange,
  source,
  operation,
}: AmountDialogProps) => {
  const { editPaymentSource } = useFinance();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");

  const handleSave = () => {
    if (!amount.trim() || isNaN(Number(amount))) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const numAmount = Number(amount);
    const newAmount = operation === "add" 
      ? source.amount + numAmount
      : source.amount - numAmount;

    if (newAmount < 0) {
      toast({
        title: "Error",
        description: "Amount cannot be negative",
        variant: "destructive",
      });
      return;
    }

    editPaymentSource({
      ...source,
      amount: newAmount,
    });

    toast({
      title: "Success",
      description: `Amount ${operation === "add" ? "added to" : "subtracted from"} ${source.name}`,
    });

    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {operation === "add" ? "Add Amount" : "Subtract Amount"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              ₹
            </span>
            <Input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-8 h-14 text-2xl rounded-[12px]"
            />
          </div>
          <Button onClick={handleSave} className="h-14 rounded-[12px]">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};