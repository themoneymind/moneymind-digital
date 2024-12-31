import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { CategorySelector } from "./CategorySelector";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { TransactionDateSelector } from "./TransactionDateSelector";
import { RepeatSelector } from "./RepeatSelector";
import { ArrowLeftRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TransactionFormProps = {
  type: "income" | "expense" | "transfer";
  amount: string;
  category: string;
  source: string;
  description: string;
  selectedDate: Date;
  onTypeChange: (type: "income" | "expense" | "transfer") => void;
  onAmountChange: (amount: string) => void;
  onCategoryChange: (category: string) => void;
  onSourceChange: (source: string) => void;
  onDescriptionChange: (description: string) => void;
  onDateChange: (date: Date) => void;
  onSubmit: () => void;
  customCategories: {
    expense: string[];
    income: string[];
  };
  onAddCustomCategory: (category: string) => void;
  formattedSources: { id: string; name: string }[];
  toSource?: string;
  onToSourceChange?: (source: string) => void;
};

export const TransactionForm = ({
  type,
  amount,
  category,
  source,
  description,
  selectedDate,
  onTypeChange,
  onAmountChange,
  onCategoryChange,
  onSourceChange,
  onDescriptionChange,
  onDateChange,
  onSubmit,
  customCategories,
  onAddCustomCategory,
  formattedSources,
  toSource,
  onToSourceChange,
}: TransactionFormProps) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <TransactionTypeSelector
        type={type}
        onTypeChange={onTypeChange}
      />

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
        <Input
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="pl-8 h-12 text-lg rounded-[12px]"
        />
      </div>

      {type === "transfer" ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">From</label>
            <PaymentSourceSelector
              source={source}
              onSourceChange={onSourceChange}
              formattedSources={formattedSources}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">To</label>
            <Select value={toSource} onValueChange={onToSourceChange}>
              <SelectTrigger className="h-12 rounded-[12px]">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {formattedSources
                  .filter(s => s.id !== source) // Exclude the source account
                  .map(source => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <>
          <CategorySelector
            type={type}
            category={category}
            onCategoryChange={onCategoryChange}
            customCategories={customCategories}
            onAddCustomCategory={onAddCustomCategory}
          />

          <PaymentSourceSelector
            source={source}
            onSourceChange={onSourceChange}
            formattedSources={formattedSources}
          />
        </>
      )}

      <TransactionDateSelector
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />

      <Textarea
        placeholder="Add a description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="rounded-[12px] resize-none"
      />

      <RepeatSelector value="never" onValueChange={() => {}} />

      <Button
        type="submit"
        className="w-full h-12 rounded-[12px] bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
      >
        {type === "transfer" ? (
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Transfer
          </div>
        ) : (
          type === "income" ? "Add Income" : "Add Expense"
        )}
      </Button>
    </form>
  );
};