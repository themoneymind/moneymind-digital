import { TransactionType } from "@/types/finance";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { TransactionAmountInput } from "./TransactionAmountInput";
import { TransactionFormFields } from "./TransactionFormFields";

type TransactionFormProps = {
  type: TransactionType;
  amount: string;
  category: string;
  source: string;
  destinationSource: string;
  description: string;
  selectedDate: Date;
  onTypeChange: (type: TransactionType) => void;
  onAmountChange: (amount: string) => void;
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

export const TransactionForm = ({
  type,
  amount,
  category,
  source,
  destinationSource,
  description,
  selectedDate,
  onTypeChange,
  onAmountChange,
  onCategoryChange,
  onSourceChange,
  onDestinationSourceChange,
  onDescriptionChange,
  onDateChange,
  onSubmit,
  customCategories,
  formattedSources,
}: TransactionFormProps) => {
  return (
    <div className="space-y-3">
      <TransactionAmountInput 
        amount={amount}
        onAmountChange={onAmountChange}
      />

      <TransactionTypeSelector type={type} onTypeChange={onTypeChange} />

      <TransactionFormFields
        type={type}
        category={category}
        source={source}
        destinationSource={destinationSource}
        description={description}
        selectedDate={selectedDate}
        onCategoryChange={onCategoryChange}
        onSourceChange={onSourceChange}
        onDestinationSourceChange={onDestinationSourceChange}
        onDescriptionChange={onDescriptionChange}
        onDateChange={onDateChange}
        onSubmit={onSubmit}
        customCategories={customCategories}
        formattedSources={formattedSources}
      />
    </div>
  );
};