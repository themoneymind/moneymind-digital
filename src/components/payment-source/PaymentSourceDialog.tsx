import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { PaymentSourceDialogForm } from "./PaymentSourceDialogForm";

type PaymentSourceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: {
    id: string;
    name: string;
    type: string;
    amount: number;
    linked?: boolean;
    upi_apps?: string[];
  };
};

export const PaymentSourceDialog = ({
  open,
  onOpenChange,
  source,
}: PaymentSourceDialogProps) => {
  const { editPaymentSource, refreshData } = useFinance();
  const { toast } = useToast();
  const [name, setName] = useState(source?.name || "");
  const [selectedUpiApps, setSelectedUpiApps] = useState<string[]>(
    source?.upi_apps || []
  );
  const [amount, setAmount] = useState("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = async (e: React.MouseEvent) => {
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
    if (operation === "subtract" && numAmount > source.amount) {
      toast({
        title: "Error",
        description: "Cannot subtract more than the available balance",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newAmount = operation === "add" 
        ? source.amount + numAmount 
        : source.amount - numAmount;

      await editPaymentSource({
        ...source,
        amount: newAmount,
        name: name.trim(),
        linked: selectedUpiApps.length > 0,
        upi_apps: selectedUpiApps.length > 0 ? selectedUpiApps : undefined,
      });

      // Force a complete data refresh
      await refreshData();

      toast({
        title: "Success",
        description: `Amount ${operation}ed ${operation === 'add' ? 'to' : 'from'} ${name}`,
      });

      handleDialogClose(false);
    } catch (error) {
      console.error("Error updating payment source:", error);
      toast({
        title: "Error",
        description: "Failed to update payment source",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setAmount("");
      setOperation("add");
      setName(source?.name || "");
      setSelectedUpiApps(source?.upi_apps || []);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Payment Source</DialogTitle>
        </DialogHeader>
        <PaymentSourceDialogForm
          name={name}
          setName={setName}
          selectedUpiApps={selectedUpiApps}
          onUpiToggle={(app) => {
            setSelectedUpiApps(prev =>
              prev.includes(app)
                ? prev.filter(a => a !== app)
                : [...prev, app]
            );
          }}
          operation={operation}
          setOperation={setOperation}
          amount={amount}
          setAmount={setAmount}
          sourceType={source?.type}
        />
        <Button 
          onClick={handleAmountChange} 
          className="h-12 rounded-[12px] mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};