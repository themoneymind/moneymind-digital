import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus } from "lucide-react";
import { TransactionSelectDialog } from "./TransactionSelectDialog";

const UPI_APPS = ["GPay", "PhonePe", "Cred", "IppoPay"];

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
      // For subtract operation, show transaction select dialog
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
        <DialogContent 
          className="sm:max-w-[425px]"
          onInteractOutside={(e) => {
            e.preventDefault();
            handleDialogClose();
          }}
        >
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
              <div className="space-y-2">
                <h3 className="font-medium text-base">UPI Apps</h3>
                <div className="grid grid-cols-2 gap-4">
                  {UPI_APPS.map((app) => (
                    <div
                      key={app}
                      className="flex items-center space-x-3 bg-white p-4 rounded-[12px] border"
                    >
                      <Checkbox
                        id={app}
                        checked={selectedUpiApps.includes(app)}
                        onCheckedChange={() => handleUpiToggle(app)}
                      />
                      <label
                        htmlFor={app}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {app}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={operation === "add" ? "default" : "outline"}
                  onClick={() => setOperation("add")}
                  className="flex-1 h-12 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
                <Button
                  type="button"
                  variant={operation === "subtract" ? "default" : "outline"}
                  onClick={() => setOperation("subtract")}
                  className="flex-1 h-12 gap-2"
                >
                  <Minus className="w-4 h-4" />
                  Subtract
                </Button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 h-12 text-lg rounded-[12px]"
                />
              </div>
            </div>
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