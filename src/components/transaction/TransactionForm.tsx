import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { CategorySelector } from "./CategorySelector";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { TransactionDateSelector } from "./TransactionDateSelector";
import { RepeatSelector } from "./RepeatSelector";
import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";

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
  const [fromSource, setFromSource] = useState(source);
  const [toSource, setToSource] = useState("");

  const handleFromSourceChange = (newSource: string) => {
    setFromSource(newSource);
    onSourceChange(newSource);
  };

  const handleToSourceChange = (newSource: string) => {
    setToSource(newSource);
    if (fromSource) {
      onSourceChange(newSource);
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "expense":
        return "bg-red-50";
      case "income":
        return "bg-green-50";
      case "transfer":
        return "bg-purple-50";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative mt-2 mb-8">
        <div className="flex items-center border-b-2 border-gray-200 focus-within:border-primary py-2">
          <span className="text-3xl font-semibold text-gray-500 mr-2">₹</span>
          <input
            type="number"
            placeholder="0"
            className="text-4xl font-semibold w-full focus:outline-none bg-transparent"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
          />
        </div>
      </div>

      <TransactionTypeSelector type={type} onTypeChange={onTypeChange} />

      <div className={`space-y-6 mt-6 p-4 rounded-2xl ${getBgColor()}`}>
        <CategorySelector
          type={type}
          category={category}
          onCategoryChange={onCategoryChange}
          customCategories={customCategories}
        />

        {type === "transfer" ? (
          <div className="flex items-center gap-0">
            <div className="w-[46%]">
              <PaymentSourceSelector
                source={fromSource}
                onSourceChange={handleFromSourceChange}
                formattedSources={formattedSources}
                placeholder="From"
                showAddButton={false}
              />
            </div>
            <div className="flex-shrink-0 flex items-center justify-center w-[8%]">
              <ArrowLeftRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="w-[46%]">
              <PaymentSourceSelector
                source={toSource}
                onSourceChange={handleToSourceChange}
                formattedSources={formattedSources}
                placeholder="To"
                isTransferTo={true}
                fromSource={fromSource}
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

        <div className="relative">
          <input
            placeholder="Add a description"
            className="w-full py-2 px-0 text-sm bg-transparent border-b-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>

        <RepeatSelector
          value="never"
          onValueChange={() => {}}
        />

        <Button
          className={`w-full h-12 rounded-[12px] text-sm ${
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