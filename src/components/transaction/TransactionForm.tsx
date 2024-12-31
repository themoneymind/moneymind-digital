import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { CategorySelector } from "./CategorySelector";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { TransactionDateSelector } from "./TransactionDateSelector";
import { RepeatSelector } from "./RepeatSelector";
import { ArrowLeftRight, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

type TransactionFormProps = {
  type: "income" | "expense" | "transfer";
  amount: string;
  category: string;
  source: string;
  description: string;
  selectedDate: Date;
  onTypeChange: (type: "income" | "expense" | "transfer") => void;
  onAmountChange: (amount: string) => void;
  onCategoryChange: (category: string) => void;
  onSourceChange: (source: string) => void;
  onDescriptionChange: (description: string) => void;
  onDateChange: (date: Date) => void;
  onSubmit: () => void;
  customCategories: {
    expense: string[];
    income: string[];
  };
  onAddCustomCategory: (category: string) => void;
  formattedSources: { id: string; name: string }[];
  toSource?: string;
  onToSourceChange?: (source: string) => void;
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
  toSource,
  onToSourceChange,
}: TransactionFormProps) => {
  const navigate = useNavigate();

  const handleAddSource = () => {
    navigate("/app/payment-source");
  };

  // Filter sources for the "To" dropdown based on selected source
  const getFilteredDestinationSources = () => {
    if (!source) return formattedSources;

    const selectedSource = formattedSources.find(s => s.id === source);
    if (!selectedSource) return formattedSources;

    // Get base name without UPI app
    const baseName = selectedSource.name.split(' ')[0];

    return formattedSources.filter(s => {
      // Don't show the selected source
      if (s.id === source) return false;

      // If source is a bank account, filter out related UPI
      if (selectedSource.name.toLowerCase().includes('bank')) {
        return !s.name.toLowerCase().includes(baseName.toLowerCase()) || 
               s.name.toLowerCase().includes('credit');
      }

      // If source is UPI, filter out related bank and UPIs
      if (selectedSource.name.toLowerCase().includes('pay')) {
        return !s.name.toLowerCase().includes(baseName.toLowerCase()) || 
               s.name.toLowerCase().includes('credit');
      }

      return true;
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <TransactionTypeSelector
        type={type}
        onTypeChange={onTypeChange}
      />

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
        <Input
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="pl-8 h-12 text-lg rounded-[12px]"
        />
      </div>

      {type === "transfer" ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">From Payment Source</label>
            <PaymentSourceSelector
              source={source}
              onSourceChange={onSourceChange}
              formattedSources={formattedSources}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">To Payment Source</label>
            <Select value={toSource} onValueChange={onToSourceChange}>
              <SelectTrigger className="h-12 rounded-[12px]">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {getFilteredDestinationSources()
                  .map(source => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <>
          <CategorySelector
            type={type}
            category={category}
            onCategoryChange={onCategoryChange}
            customCategories={customCategories}
            onAddCustomCategory={onAddCustomCategory}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Payment Source</label>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-[12px]"
                onClick={handleAddSource}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <PaymentSourceSelector
              source={source}
              onSourceChange={onSourceChange}
              formattedSources={formattedSources}
            />
          </div>
        </>
      )}

      <TransactionDateSelector
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />

      <Textarea
        placeholder="Add a description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="rounded-[12px] resize-none"
      />

      <RepeatSelector value="never" onValueChange={() => {}} />

      <Button
        type="submit"
        className={`w-full h-12 rounded-[12px] ${
          type === "transfer"
            ? "bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
            : type === "income"
            ? "bg-[#00A86B] hover:bg-[#00A86B]/90"
            : "bg-[#FD3C4A] hover:bg-[#FD3C4A]/90"
        }`}
      >
        {type === "transfer" ? (
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Transfer
          </div>
        ) : (
          type === "income" ? "Add Income" : "Add Expense"
        )}
      </Button>
    </form>
  );
};