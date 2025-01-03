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
  const getBgColor = () => {
    switch (type) {
      case "expense":
        return "bg-red-500";
      case "income":
        return "bg-green-500";
      case "transfer":
        return "bg-purple-500";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="space-y-4">
      <div className={`${getBgColor()} p-8 rounded-b-[20px]`}>
        <div className="flex items-center justify-center">
          <span className="text-6xl font-medium text-white">
            {amount || "0"}
          </span>
        </div>
      </div>

      <TransactionTypeSelector type={type} onTypeChange={onTypeChange} />

      <div className="space-y-6 mt-6">
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
          className="w-full py-3 px-0 text-sm bg-transparent border-b border-gray-200 focus:border-primary focus:outline-none transition-colors placeholder:text-gray-400"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />

        <RepeatSelector value="never" onValueChange={() => {}} />

        <Button
          className={`w-full h-12 rounded-[12px] text-sm font-medium ${
            type === "expense"
              ? "bg-red-500 hover:bg-red-600"
              : type === "income"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
          }`}
          onClick={onSubmit}
        >
          Add Transaction
        </Button>
      </div>
    </div>
  );
};