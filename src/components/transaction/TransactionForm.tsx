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
      <div className="relative mt-2 mb-6">
        <div className={`p-8 rounded-b-[20px] ${getBgColor()}`}>
          <div className="flex items-center justify-center">
            <span className="text-6xl font-medium text-white">
              {amount || "0"}
            </span>
          </div>
        </div>
      </div>

      <TransactionTypeSelector type={type} onTypeChange={onTypeChange} />

      <div className="space-y-4 mt-4">
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
            className="w-full py-3 px-0 text-sm bg-transparent border-b border-gray-200 focus:border-primary focus:outline-none transition-colors placeholder:text-gray-400"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>

        <RepeatSelector
          value="never"
          onValueChange={() => {}}
        />

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
