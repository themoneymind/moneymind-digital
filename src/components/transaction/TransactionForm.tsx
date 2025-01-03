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

      <div className="relative px-4 py-6">
        <span className="absolute left-8 top-1/2 -translate-y-1/2 text-2xl text-gray-400">₹</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="w-full text-4xl font-medium text-center bg-transparent focus:outline-none"
          placeholder="0"
        />
      </div>

      <div className="space-y-4 mt-4 px-4">
        <CategorySelector
          type={type}
          category={category}
          onCategoryChange={onCategoryChange}
          customCategories={customCategories}
        />

        {type === "transfer" ? (
          <div className="grid grid-cols-2 gap-4">
            <PaymentSourceSelector
              source={source}
              onSourceChange={onSourceChange}
              formattedSources={formattedSources}
              placeholder="Transfer from"
            />
            <PaymentSourceSelector
              source={source}
              onSourceChange={onSourceChange}
              formattedSources={formattedSources.filter(s => s.id !== source)}
              placeholder="Transfer to"
              isTransferTo={true}
              fromSource={source}
            />
          </div>
        ) : (
          <PaymentSourceSelector
            source={source}
            onSourceChange={onSourceChange}
            formattedSources={formattedSources}
          />
        )}

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