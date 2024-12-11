import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
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
};

export const PaymentSourceDialog = ({
  open,
  onOpenChange,
  source,
}: PaymentSourceDialogProps) => {
  const [name, setName] = useState(source?.name || "");
  const [selectedUpiApps, setSelectedUpiApps] = useState<string[]>(
    source?.upi_apps || []
  );
  const [amount, setAmount] = useState("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setAmount("");
      setOperation("add");
      setName(source?.name || "");
      setSelectedUpiApps(source?.upi_apps || []);
    }
    onOpenChange(open);
  };

  const { isSubmitting, handleAmountChange } = usePaymentSourceOperations(
    source,
    () => handleDialogClose(false)
  );

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount))) {
      return;
    }
    await handleAmountChange(operation, amount, name, selectedUpiApps);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
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