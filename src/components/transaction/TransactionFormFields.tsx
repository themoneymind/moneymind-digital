import { TransactionType } from "@/types/finance";
import { CategorySelector } from "./CategorySelector";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { TransactionDateSelector } from "./TransactionDateSelector";
import { RepeatSelector } from "./RepeatSelector";
import { Button } from "@/components/ui/button";

type TransactionFormFieldsProps = {
  type: TransactionType;
  category: string;
  source: string;
  destinationSource: string;
  description: string;
  selectedDate: Date;
  onCategoryChange: (category: string) => void;
  onSourceChange: (source: string) => void;
  onDestinationSourceChange: (source: string) => void;
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

export const TransactionFormFields = ({
  type,
  category,
  source,
  destinationSource,
  description,
  selectedDate,
  onCategoryChange,
  onSourceChange,
  onDestinationSourceChange,
  onDescriptionChange,
  onDateChange,
  onSubmit,
  customCategories,
  formattedSources,
}: TransactionFormFieldsProps) => {
  return (
    <div className="space-y-4 mt-2 px-4">
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
            type={type}
          />
          <PaymentSourceSelector
            source={destinationSource}
            onSourceChange={onDestinationSourceChange}
            formattedSources={formattedSources.filter(s => s.id !== source)}
            placeholder="Transfer to"
            isTransferTo={true}
            fromSource={source}
            type={type}
          />
        </div>
      ) : (
        <PaymentSourceSelector
          source={source}
          onSourceChange={onSourceChange}
          formattedSources={formattedSources}
          type={type}
        />
      )}

      <TransactionDateSelector
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        type={type}
      />

      <input
        placeholder="Add a description"
        className={`w-full py-3 px-0 text-[15px] bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 ${
          type === 'expense' 
            ? 'focus:border-transaction-expense' 
            : type === 'income'
            ? 'focus:border-transaction-income'
            : type === 'transfer'
            ? 'focus:border-transaction-transfer'
            : 'focus:border-primary'
        }`}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />

      <RepeatSelector 
        value="never" 
        onValueChange={() => {}}
        type={type}
      />

      <Button
        className={`w-full h-12 rounded-[12px] text-[15px] font-medium text-white ${
          type === 'expense' 
            ? 'bg-transaction-expense hover:bg-transaction-expense/90' 
            : type === 'income'
            ? 'bg-transaction-income hover:bg-transaction-income/90'
            : type === 'transfer'
            ? 'bg-transaction-transfer hover:bg-transaction-transfer/90'
            : 'bg-primary hover:bg-primary/90'
        }`}
        onClick={onSubmit}
      >
        Add Transaction
      </Button>
    </div>
  );
};