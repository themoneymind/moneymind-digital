import { Button } from "@/components/ui/button";
import { PaymentSourceDialogForm } from "./PaymentSourceDialogForm";

interface PaymentSourceDialogContentProps {
  name: string;
  setName: (name: string) => void;
  selectedUpiApps: string[];
  setSelectedUpiApps: (apps: string[]) => void;
  operation: "add" | "subtract";
  setOperation: (op: "add" | "subtract") => void;
  amount: string;
  setAmount: (amount: string) => void;
  sourceType?: string;
  onSave: () => void;
  isSubmitting: boolean;
}

export const PaymentSourceDialogContent = ({
  name,
  setName,
  selectedUpiApps,
  setSelectedUpiApps,
  operation,
  setOperation,
  amount,
  setAmount,
  sourceType,
  onSave,
  isSubmitting,
}: PaymentSourceDialogContentProps) => {
  const handleUpiToggle = (app: string) => {
    const newApps = selectedUpiApps.includes(app)
      ? selectedUpiApps.filter(a => a !== app)
      : [...selectedUpiApps, app];
    setSelectedUpiApps(newApps);
  };

  return (
    <div className="space-y-4">
      <PaymentSourceDialogForm
        name={name}
        setName={setName}
        selectedUpiApps={selectedUpiApps}
        onUpiToggle={handleUpiToggle}
        operation={operation}
        setOperation={setOperation}
        amount={amount}
        setAmount={setAmount}
        sourceType={sourceType}
      />
      <Button 
        onClick={onSave} 
        className="h-12 rounded-[12px] mt-2 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};