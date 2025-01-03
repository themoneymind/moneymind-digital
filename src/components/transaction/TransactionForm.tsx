import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  onDateChange,
  onDescriptionChange,
  onSubmit,
  customCategories,
  formattedSources,
}: TransactionFormProps) => {
  const formatCurrency = (amount: string) => {
    const num = Number(amount);
    if (isNaN(num)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-4">
      <TransactionTypeSelector type={type} onTypeChange={onTypeChange} />
      
      {type === "transfer" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-[12px] border border-gray-100">
            <p className="text-sm text-gray-500">Transfer Amount</p>
            <p className="text-lg font-semibold">{formatCurrency(amount)}</p>
          </div>
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
        </div>
      ) : (
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
      )}

      <CategorySelector
        type={type}
        category={category}
        onCategoryChange={onCategoryChange}
        customCategories={customCategories}
      />

      {type === "transfer" ? (
        <>
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
            isTransferTo={true}
            fromSource={source}
          />
        </>
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