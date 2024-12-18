import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
}: TransactionEditDialogFormProps) => {
  return (
    <div className="space-y-6">
      <TransactionAmountOperations
        currentAmount={currentAmount}
        operation={operation}
        setOperation={setOperation}
        amount={amount}
        setAmount={setAmount}
      />

      <div className="space-y-2">
        <label htmlFor="source" className="text-sm font-medium">
          Payment Source
        </label>
        <Select 
          value={selectedSource} 
          onValueChange={setSelectedSource}
          onOpenChange={onDropdownOpenChange}
        >
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