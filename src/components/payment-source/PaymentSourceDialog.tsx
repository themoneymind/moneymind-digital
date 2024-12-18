import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { PaymentSourceDialogContent } from "./PaymentSourceDialogContent";
import { usePaymentSourceOperations } from "@/hooks/usePaymentSourceOperations";

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
  onDelete?: () => void;  // Added this prop definition
};

export const PaymentSourceDialog = ({
  open,
  onOpenChange,
  source,
  onDelete,  // Added this to destructuring
}: PaymentSourceDialogProps) => {
  const [name, setName] = useState("");
  const [selectedUpiApps, setSelectedUpiApps] = useState<string[]>([]);
  const [amount, setAmount] = useState("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [isClosing, setIsClosing] = useState(false);

  const resetState = useCallback(() => {
    setAmount("");
    setOperation("add");
    setName(source?.name || "");
    setSelectedUpiApps(source?.upi_apps || []);
    setIsClosing(false);
  }, [source]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      resetState();
    }
  }, [open, resetState]);

  const { isSubmitting, handleAmountChange } = usePaymentSourceOperations(
    source,
    () => {
      setIsClosing(true);
      onOpenChange(false);
    }
  );

  const handleDialogChange = useCallback((newOpen: boolean) => {
    if (!newOpen && !isClosing) {
      setIsClosing(true);
      onOpenChange(false);
    }
  }, [onOpenChange, isClosing]);

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount))) {
      return;
    }
    await handleAmountChange(operation, amount, name, selectedUpiApps);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Payment Source</DialogTitle>
        </DialogHeader>
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
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};