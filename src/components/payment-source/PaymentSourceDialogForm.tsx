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
  customUpi: string;
  onCustomUpiChange: (value: string) => void;
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
  customUpi,
  onCustomUpiChange,
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
          customUpi={customUpi}
          onCustomUpiChange={onCustomUpiChange}
        />
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
        <Input
          type="number"
          placeholder="Enter Current Balance (Optional)"
          value={currentAmount}
          onChange={(e) => setAmount(e.target.value)}
          className="pl-8 h-12 rounded-[12px] text-base placeholder:text-gray-400"
        />
      </div>
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