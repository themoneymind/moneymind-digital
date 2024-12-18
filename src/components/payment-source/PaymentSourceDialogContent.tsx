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
  onDelete?: () => void;
  isSubmitting: boolean;
  currentAmount: number;
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
  onDelete,
  isSubmitting,
  currentAmount,
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
        currentAmount={currentAmount}
      />
      <div className="flex gap-2">
        <Button 
          onClick={onSave} 
          className="flex-1 h-12 rounded-[12px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        {onDelete && (
          <Button 
            onClick={onDelete}
            variant="destructive"
            className="flex-1 h-12 rounded-[12px] bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};