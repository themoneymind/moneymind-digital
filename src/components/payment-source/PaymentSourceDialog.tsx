import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus } from "lucide-react";

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
  const { editPaymentSource } = useFinance();
  const { toast } = useToast();
  const [name, setName] = useState(source?.name || "");
  const [selectedUpiApps, setSelectedUpiApps] = useState<string[]>(
    source?.upiApps || []
  );
  const [amount, setAmount] = useState("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  const handleUpiToggle = (upiApp: string) => {
    setSelectedUpiApps((prev) =>
      prev.includes(upiApp)
        ? prev.filter((app) => app !== upiApp)
        : [...prev, upiApp]
    );
  };

  const handleAmountChange = () => {
    if (!source || !amount.trim() || isNaN(Number(amount))) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const numAmount = Number(amount);
    const newAmount = operation === "add" 
      ? (source.amount + numAmount)
      : (source.amount - numAmount);

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
      name: name.trim(),
      linked: selectedUpiApps.length > 0,
      upiApps: selectedUpiApps.length > 0 ? selectedUpiApps : undefined,
    });

    toast({
      title: "Success",
      description: `Amount ${operation === "add" ? "added to" : "subtracted from"} ${name}`,
    });

    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
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
  );
};