import { Input } from "@/components/ui/input";
import { UpiAppsSelector } from "./UpiAppsSelector";
import { AmountOperations } from "./AmountOperations";

interface PaymentSourceDialogFormProps {
  name: string;
  setName: (name: string) => void;
  selectedUpiApps: string[];
  onUpiToggle: (upiApp: string) => void;
  operation: "add" | "subtract";
  setOperation: (op: "add" | "subtract") => void;
  amount: string;
  setAmount: (amount: string) => void;
  sourceType?: string;
  currentAmount: number;
}

export const PaymentSourceDialogForm = ({
  name,
  setName,
  selectedUpiApps,
  onUpiToggle,
  operation,
  setOperation,
  amount,
  setAmount,
  sourceType,
  currentAmount,
}: PaymentSourceDialogFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Input
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 rounded-[12px] text-base"
        />
      </div>
      {sourceType === "Bank" && (
        <UpiAppsSelector
          selectedUpiApps={selectedUpiApps}
          onUpiToggle={onUpiToggle}
        />
      )}
      <AmountOperations
        operation={operation}
        setOperation={setOperation}
        amount={amount}
        setAmount={setAmount}
        currentAmount={currentAmount}
      />
    </div>
  );
};