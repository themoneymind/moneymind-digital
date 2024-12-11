import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionAmountOperations } from "./TransactionAmountOperations";
import { Transaction } from "@/types/finance";
import { useFinance } from "@/contexts/FinanceContext";

interface TransactionEditDialogFormProps {
  transaction: Transaction;
  onClose: () => void;
}

export const TransactionEditDialogForm = ({
  transaction,
  onClose
}: TransactionEditDialogFormProps) => {
  const { paymentSources } = useFinance();
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [selectedSource, setSelectedSource] = useState(transaction.source);
  const [description, setDescription] = useState(transaction.description || "");

  const formattedSources = paymentSources.map(source => ({
    id: source.id,
    name: source.name
  }));

  return (
    <div className="space-y-6">
      <TransactionAmountOperations
        currentAmount={transaction.amount}
        operation={operation}
        setOperation={setOperation}
        amount={amount}
        setAmount={setAmount}
      />

      <div className="space-y-2">
        <label htmlFor="source" className="text-sm font-medium">
          Payment Source
        </label>
        <Select value={selectedSource} onValueChange={setSelectedSource}>
          <SelectTrigger className="h-12 rounded-[12px]">
            <SelectValue placeholder="Select payment source" />
          </SelectTrigger>
          <SelectContent>
            {formattedSources.map((source) => (
              <SelectItem key={source.id} value={source.id}>
                {source.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-12 rounded-[12px]"
        />
      </div>
    </div>
  );
};