import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionAmountOperations } from "./TransactionAmountOperations";
import { TransactionDateSelector } from "./TransactionDateSelector";
import { RepeatSelector } from "./RepeatSelector";
import { RepeatOption } from "@/types/transactions";

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
  repeatOption: RepeatOption;
  onRepeatOptionChange: (option: RepeatOption) => void;
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
  repeatOption,
  onRepeatOptionChange,
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
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            {formattedSources.map((source) => (
              <SelectItem key={source.id} value={source.id}>
                {source.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <TransactionDateSelector
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Repeat</label>
        <RepeatSelector
          value={repeatOption}
          onValueChange={onRepeatOptionChange}
        />
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