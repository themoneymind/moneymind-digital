import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { CategorySelector } from "./CategorySelector";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { TransactionDateSelector } from "./TransactionDateSelector";
import { RepeatSelector } from "./RepeatSelector";

type TransactionFormProps = {
  type: TransactionType;
  amount: string;
  category: string;
  source: string;
  description: string;
  selectedDate: Date;
  onTypeChange: (type: TransactionType) => void;
  onAmountChange: (amount: string) => void;
  onCategoryChange: (category: string) => void;
  onSourceChange: (source: string) => void;
  onDescriptionChange: (description: string) => void;
  onDateChange: (date: Date) => void;
  onSubmit: () => void;
  customCategories: {
    expense: string[];
    income: string[];
    transfer: string[];
  };
  formattedSources: { id: string; name: string }[];
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
  formattedSources,
}: TransactionFormProps) => {
  return (
    <div className="space-y-3">
      <TransactionTypeSelector type={type} onTypeChange={onTypeChange} />

      <div className="space-y-4 mt-4 px-4">
        <CategorySelector
          type={type}
          category={category}
          onCategoryChange={onCategoryChange}
          customCategories={customCategories}
        />

        <PaymentSourceSelector
          source={source}
          onSourceChange={onSourceChange}
          formattedSources={formattedSources}
        />

        <TransactionDateSelector
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />

        <input
          placeholder="Add a description"
          className="w-full py-3 px-0 text-sm bg-transparent border-b border-gray-200 focus:border-[#FF3B30] focus:outline-none transition-colors placeholder:text-gray-400"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />

        <RepeatSelector value="never" onValueChange={() => {}} />

        <Button
          className="w-full h-12 rounded-[12px] text-sm font-medium bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white"
          onClick={onSubmit}
        >
          Add Transaction
        </Button>
      </div>
    </div>
  );
};