import { TransactionType } from "@/types/finance";
import { CategorySelector } from "./CategorySelector";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { TransactionDateSelector } from "./TransactionDateSelector";
import { RepeatSelector } from "./RepeatSelector";
import { TransferSourceSelectors } from "./TransferSourceSelectors";
import { TransactionFormActions } from "./TransactionFormActions";

type TransactionFormFieldsProps = {
  type: TransactionType;
  category: string;
  source: string;
  description: string;
  selectedDate: Date;
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

export const TransactionFormFields = ({
  type,
  category,
  source,
  description,
  selectedDate,
  onCategoryChange,
  onSourceChange,
  onDescriptionChange,
  onDateChange,
  onSubmit,
  customCategories,
  formattedSources,
}: TransactionFormFieldsProps) => {
  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="space-y-4 mt-2 px-4">
      <CategorySelector
        type={type}
        category={category}
        onCategoryChange={onCategoryChange}
        customCategories={customCategories}
      />

      {type === "transfer" ? (
        <TransferSourceSelectors
          source={source}
          onSourceChange={onSourceChange}
          formattedSources={formattedSources}
        />
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
        className={`w-full py-3 px-0 text-sm bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 ${
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

      <TransactionFormActions type={type} onSubmit={handleSubmit} />
    </div>
  );
};