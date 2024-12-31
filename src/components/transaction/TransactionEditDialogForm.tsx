import { Input } from "@/components/ui/input";
import { TransactionType } from "@/types/finance";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { TransactionDateSelector } from "./TransactionDateSelector";
import { RepeatSelector } from "./RepeatSelector";
import { RepeatOption } from "@/types/transactions";
import { TransactionAmountOperations } from "./TransactionAmountOperations";

interface TransactionEditDialogFormProps {
  currentAmount: number;
  operation: "add" | "subtract";
  setOperation: (op: "add" | "subtract") => void;
  amount: string;
  setAmount: (amount: string) => void;
  selectedSource: string;
  setSelectedSource: (source: string) => void;
  description: string;
  setDescription: (description: string) => void;
  formattedSources: { id: string; name: string }[];
  onDropdownOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  repeatFrequency: RepeatOption;
  onRepeatChange: (frequency: RepeatOption) => void;
  transactionType?: TransactionType;
}

export const TransactionEditDialogForm = ({
  currentAmount,
  operation,
  setOperation,
  amount,
  setAmount,
  selectedSource,
  setSelectedSource,
  description,
  setDescription,
  formattedSources,
  onDropdownOpenChange,
  selectedDate,
  onDateChange,
  repeatFrequency,
  onRepeatChange,
  transactionType,
}: TransactionEditDialogFormProps) => {
  return (
    <div className="space-y-4">
      {transactionType !== "transfer" && (
        <TransactionAmountOperations
          currentAmount={currentAmount}
          operation={operation}
          setOperation={setOperation}
          amount={amount}
          setAmount={setAmount}
        />
      )}

      {transactionType === "transfer" ? (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-[12px] border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Transfer Amount</p>
            <p className="text-lg font-semibold">₹{currentAmount}</p>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <Input
              type="number"
              placeholder="0"
              className="text-sm pl-8 h-12 border-gray-200 rounded-[12px] bg-white"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
      ) : null}

      <PaymentSourceSelector
        source={selectedSource}
        onSourceChange={setSelectedSource}
        formattedSources={formattedSources}
        placeholder={transactionType === "transfer" ? "Transfer from" : "Select payment source"}
      />

      {transactionType === "transfer" && (
        <PaymentSourceSelector
          source={selectedSource}
          onSourceChange={setSelectedSource}
          formattedSources={formattedSources.filter(s => s.id !== selectedSource)}
          placeholder="Transfer to"
          isTransferTo={true}
          fromSource={selectedSource}
        />
      )}

      <TransactionDateSelector
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />

      <RepeatSelector
        value={repeatFrequency}
        onValueChange={onRepeatChange}
      />

      <Input
        placeholder="Add a description"
        className="h-12 border-gray-200 rounded-[12px] text-sm bg-white"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
};