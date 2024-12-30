import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";
import { RepeatOption } from "@/types/transactions";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { CategorySelector } from "./CategorySelector";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { TransactionDateSelector } from "./TransactionDateSelector";
import { RepeatSelector } from "./RepeatSelector";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type TransactionFormProps = {
  type: TransactionType;
  amount: string;
  category: string;
  source: string;
  description: string;
  onTypeChange: (type: TransactionType) => void;
  onAmountChange: (amount: string) => void;
  onCategoryChange: (category: string) => void;
  onSourceChange: (source: string) => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => void;
  customCategories: {
    expense: string[];
    income: string[];
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
  onTypeChange,
  onAmountChange,
  onCategoryChange,
  onSourceChange,
  onDescriptionChange,
  onSubmit,
  customCategories,
  onAddCustomCategory,
  formattedSources,
}: TransactionFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [repeatOption, setRepeatOption] = useState<RepeatOption>("never");
  const navigate = useNavigate();

  const defaultExpenseCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Healthcare",
    "Education",
    "Groceries",
    "Rent",
    "Travel",
    "Other"
  ];

  const defaultIncomeCategories = [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
    "Rental",
    "Dividends",
    "Commission",
    "Bonus",
    "Other"
  ];

  return (
    <div className="space-y-4">
      <TransactionTypeSelector type={type} onTypeChange={onTypeChange} />
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
        <Input
          type="number"
          placeholder="0"
          className="text-2xl pl-8 h-14 border-gray-200 rounded-[12px]"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
        />
      </div>
      <CategorySelector
        type={type}
        category={category}
        onCategoryChange={onCategoryChange}
        customCategories={{
          expense: [...defaultExpenseCategories, ...customCategories.expense],
          income: [...defaultIncomeCategories, ...customCategories.income],
        }}
        onAddCustomCategory={onAddCustomCategory}
      />
      <div className="flex gap-2">
        <PaymentSourceSelector
          source={source}
          onSourceChange={onSourceChange}
          formattedSources={formattedSources}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 border-gray-200 rounded-[12px] flex-shrink-0"
          onClick={() => navigate("/payment-source")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <TransactionDateSelector
        selectedDate={selectedDate}
        onDateChange={(date) => date && setSelectedDate(date)}
      />
      <Input
        placeholder="Description or note (Optional)"
        className="h-14 border-gray-200 rounded-[12px]"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <RepeatSelector
        value={repeatOption}
        onValueChange={setRepeatOption}
      />
      <Button
        className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-[12px]"
        onClick={onSubmit}
      >
        Add Transaction
      </Button>
    </div>
  );
};