import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TransactionType } from "@/types/finance";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { CategorySelector } from "./CategorySelector";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { TransactionDateSelector } from "./TransactionDateSelector";
import { RepeatSelector } from "./RepeatSelector";
import { useNavigate } from "react-router-dom";

const DEFAULT_CATEGORIES = {
  expense: [
    "Food",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
    "Education",
    "Others"
  ],
  income: [
    "Salary",
    "Business",
    "Investment",
    "Gift",
    "Others"
  ],
  transfer: [
    "Fund Transfer",
    "Credit Card Payment",
    "Transfer to Wallet",
    "Investment Transfer",
    "Loan Payment",
    "Others"
  ]
};

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
  onAddCustomCategory: (category: string) => void;
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
  onAddCustomCategory,
  formattedSources,
}: TransactionFormProps) => {
  const navigate = useNavigate();
  
  const allCategories = {
    expense: [...DEFAULT_CATEGORIES.expense, ...customCategories.expense],
    income: [...DEFAULT_CATEGORIES.income, ...customCategories.income],
    transfer: [...DEFAULT_CATEGORIES.transfer, ...customCategories.transfer],
  };

  return (
    <div className="space-y-4 max-w-[320px] mx-auto">
      <TransactionTypeSelector type={type} onTypeChange={onTypeChange} />
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
        <Input
          type="number"
          placeholder="0"
          className="text-sm pl-7 h-10 border-gray-200 rounded-xl"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
        />
      </div>
      {type === "transfer" ? (
        <>
          <CategorySelector
            type={type}
            category={category}
            onCategoryChange={onCategoryChange}
            customCategories={allCategories}
            onAddCustomCategory={onAddCustomCategory}
          />
          <div className="space-y-4">
            <PaymentSourceSelector
              source={source}
              onSourceChange={onSourceChange}
              formattedSources={formattedSources}
              placeholder="From payment source"
            />
            <PaymentSourceSelector
              source={source}
              onSourceChange={onSourceChange}
              formattedSources={formattedSources.filter(s => s.id !== source)}
              placeholder="To payment source"
            />
          </div>
        </>
      ) : (
        <>
          <CategorySelector
            type={type}
            category={category}
            onCategoryChange={onCategoryChange}
            customCategories={allCategories}
            onAddCustomCategory={onAddCustomCategory}
          />
          <PaymentSourceSelector
            source={source}
            onSourceChange={onSourceChange}
            formattedSources={formattedSources}
            placeholder="Select payment source"
          />
        </>
      )}
      <TransactionDateSelector
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />
      <Input
        placeholder="Add a description"
        className="h-10 border-gray-200 rounded-xl text-sm"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <RepeatSelector
        value="never"
        onValueChange={() => {}}
      />
      <Button
        className="w-full h-10 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm"
        onClick={onSubmit}
      >
        Add Transaction
      </Button>
    </div>
  );
};