import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionAmountOperations } from "../TransactionAmountOperations";
import { TransactionDatePopover } from "../date-selector/TransactionDatePopover";
import { RepeatSelector } from "../RepeatSelector";

interface TransactionEditFormProps {
  currentAmount: number;
  operation: "add" | "subtract";
  setOperation: (op: "add" | "subtract") => void;
  amount: string;
  setAmount: (amount: string) => void;
  selectedSource: string;
  setSelectedSource: (source: string) => void;
  description: string;
  setDescription: (description: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  repeatOption: string;
  setRepeatOption: (option: string) => void;
  formattedSources: { id: string; name: string }[];
  onDropdownOpenChange: (open: boolean) => void;
}

export const TransactionEditForm = ({
  currentAmount,
  operation,
  setOperation,
  amount,
  setAmount,
  selectedSource,
  setSelectedSource,
  description,
  setDescription,
  selectedDate,
  setSelectedDate,
  repeatOption,
  setRepeatOption,
  formattedSources,
  onDropdownOpenChange,
}: TransactionEditFormProps) => {
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
          <SelectContent className="bg-white">
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
        <TransactionDatePopover
          selectedDate={selectedDate}
          onDateChange={(date) => date && setSelectedDate(date)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Repeat</label>
        <RepeatSelector
          value={repeatOption}
          onValueChange={setRepeatOption}
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