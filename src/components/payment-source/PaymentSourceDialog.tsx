import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { PaymentSourceDialogContent } from "./PaymentSourceDialogContent";
import { usePaymentSourceOperations } from "@/hooks/usePaymentSourceOperations";
import { useToast } from "@/hooks/use-toast";

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
  onDelete?: () => void;
};

export const PaymentSourceDialog = ({
  open,
  onOpenChange,
  source,
  onDelete,
}: PaymentSourceDialogProps) => {
  const [name, setName] = useState("");
  const [selectedUpiApps, setSelectedUpiApps] = useState<string[]>([]);
  const [amount, setAmount] = useState("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [isClosing, setIsClosing] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(source?.amount || 0);
  const { toast } = useToast();

  const resetState = useCallback(() => {
    setAmount("");
    setOperation("add");
    setName(source?.name || "");
    setSelectedUpiApps(source?.upi_apps || []);
    setIsClosing(false);
    setCurrentAmount(source?.amount || 0);
  }, [source]);

  useEffect(() => {
    if (open) {
      resetState();
    }
  }, [open, resetState]);

  useEffect(() => {
    const numAmount = Number(amount);
    if (!isNaN(numAmount) && source) {
      setCurrentAmount(operation === "add" ? source.amount + numAmount : source.amount - numAmount);
    } else {
      setCurrentAmount(source?.amount || 0);
    }
  }, [amount, operation, source]);

  const { isSubmitting, handleAmountChange } = usePaymentSourceOperations(
    source,
    () => {
      setIsClosing(true);
      onOpenChange(false);
    }
  );

  const handleDialogChange = useCallback((newOpen: boolean) => {
    if (!newOpen && !isSubmitting && !isClosing) {
      setIsClosing(true);
      onOpenChange(false);
    }
  }, [onOpenChange, isSubmitting, isClosing]);

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    await handleAmountChange(operation, amount, name, selectedUpiApps);
  };

  const handleDelete = async () => {
    if (onDelete) {
      setIsClosing(true);
      onDelete();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent 
        className="sm:max-w-[425px]" 
        onPointerDownOutside={(e) => {
          if (isSubmitting || isClosing) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting || isClosing) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Payment Source</DialogTitle>
        </DialogHeader>
        <div className="p-4 bg-gray-50 rounded-[12px] border border-gray-100 mb-4">
          <p className="text-sm text-gray-500 mb-1">Current Amount</p>
          <p className="text-lg font-semibold">{formatCurrency(currentAmount)}</p>
        </div>
        <PaymentSourceDialogContent
          name={name}
          setName={setName}
          selectedUpiApps={selectedUpiApps}
          setSelectedUpiApps={setSelectedUpiApps}
          operation={operation}
          setOperation={setOperation}
          amount={amount}
          setAmount={setAmount}
          sourceType={source?.type}
          onSave={handleSave}
          onDelete={handleDelete}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};