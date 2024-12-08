import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { TransactionSelectDialog } from "./TransactionSelectDialog";
import { UpiAppsSelector } from "./UpiAppsSelector";
import { AmountOperations } from "./AmountOperations";

type PaymentSourceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: {
    id: string;
    name: string;
    type: string;
    amount: number;
    linked?: boolean;
    upiApps?: string[];
  };
};

export const PaymentSourceDialog = ({
  open,
  onOpenChange,
  source,
}: PaymentSourceDialogProps) => {
  const { editPaymentSource, editTransaction } = useFinance();
  const { toast } = useToast();
  const [name, setName] = useState(source?.name || "");
  const [selectedUpiApps, setSelectedUpiApps] = useState<string[]>(
    source?.upiApps || []
  );
  const [amount, setAmount] = useState("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [showTransactionSelect, setShowTransactionSelect] = useState(false);

  const handleUpiToggle = (upiApp: string) => {
    setSelectedUpiApps((prev) =>
      prev.includes(upiApp)
        ? prev.filter((app) => app !== upiApp)
        : [...prev, upiApp]
    );
  };

  const handleAmountChange = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!source || !amount.trim() || isNaN(Number(amount))) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const numAmount = Number(amount);

    if (operation === "add") {
      const newAmount = source.amount + numAmount;
      editPaymentSource({
        ...source,
        amount: newAmount,
        name: name.trim(),
        linked: selectedUpiApps.length > 0,
        upiApps: selectedUpiApps.length > 0 ? selectedUpiApps : undefined,
      });

      toast({
        title: "Success",
        description: `Amount added to ${name}`,
      });

      setAmount("");
      onOpenChange(false);
    } else {
      if (numAmount > source.amount) {
        toast({
          title: "Error",
          description: "Cannot subtract more than the available balance",
          variant: "destructive",
        });
        return;
      }
      setShowTransactionSelect(true);
    }
  };

  const handleTransactionSelect = (transactionId: string) => {
    if (!source) return;

    const numAmount = Number(amount);
    editTransaction(transactionId, {
      amount: numAmount,
    });

    editPaymentSource({
      ...source,
      amount: source.amount - numAmount,
      name: name.trim(),
      linked: selectedUpiApps.length > 0,
      upiApps: selectedUpiApps.length > 0 ? selectedUpiApps : undefined,
    });

    toast({
      title: "Success",
      description: `Amount subtracted from ${name}`,
    });

    setAmount("");
    onOpenChange(false);
  };

  const handleDialogClose = () => {
    setAmount("");
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg">Edit Payment Source</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-[12px] text-base"
              />
            </div>
            {source?.type === "Bank" && (
              <UpiAppsSelector
                selectedUpiApps={selectedUpiApps}
                onUpiToggle={handleUpiToggle}
              />
            )}
            <AmountOperations
              operation={operation}
              setOperation={setOperation}
              amount={amount}
              setAmount={setAmount}
            />
            <Button onClick={handleAmountChange} className="h-12 rounded-[12px] mt-2">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {source && (
        <TransactionSelectDialog
          open={showTransactionSelect}
          onOpenChange={setShowTransactionSelect}
          sourceId={source.id}
          amountToSubtract={Number(amount)}
          onTransactionSelect={handleTransactionSelect}
        />
      )}
    </>
  );
};