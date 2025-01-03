import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TransactionType } from "@/types/finance";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { CategorySelector } from "./CategorySelector";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { TransactionDateSelector } from "./TransactionDateSelector";
import { RepeatSelector } from "./RepeatSelector";
import { ArrowLeftRight } from "lucide-react";

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
  onDateChange,
  onDescriptionChange,
  onSubmit,
  customCategories,
  formattedSources,
}: TransactionFormProps) => {
  return (
    <div className="space-y-4">
      <TransactionTypeSelector type={type} onTypeChange={onTypeChange} />
      
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
        <Input
          type="number"
          placeholder="0"
          className="text-sm pl-7 h-12 border-gray-200 rounded-[12px] bg-white"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
        />
      </div>

      <CategorySelector
        type={type}
        category={category}
        onCategoryChange={onCategoryChange}
        customCategories={customCategories}
      />

      {type === "transfer" ? (
        <div className="flex items-center gap-4">
          <div className="w-[42%]">
            <PaymentSourceSelector
              source={source}
              onSourceChange={onSourceChange}
              formattedSources={formattedSources}
              placeholder="From"
              showAddButton={false}
            />
          </div>
          <div className="flex-shrink-0 flex items-center justify-center w-[8%]">
            <ArrowLeftRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="w-[42%]">
            <PaymentSourceSelector
              source={source}
              onSourceChange={onSourceChange}
              formattedSources={formattedSources.filter(s => s.id !== source)}
              placeholder="To"
              isTransferTo={true}
              fromSource={source}
              showAddButton={true}
            />
          </div>
        </div>
      ) : (
        <PaymentSourceSelector
          source={source}
          onSourceChange={onSourceChange}
          formattedSources={formattedSources}
          placeholder="Select payment source"
        />
      )}

      <TransactionDateSelector
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />

      <Input
        placeholder="Add a description"
        className="h-12 border-gray-200 rounded-[12px] text-sm bg-white"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />

      <RepeatSelector
        value="never"
        onValueChange={() => {}}
      />

      <Button
        className="w-full h-12 bg-[#7F3DFF] hover:bg-[#7F3DFF]/90 rounded-[12px] text-sm"
        onClick={onSubmit}
      >
        Add Transaction
      </Button>
    </div>
  );
};