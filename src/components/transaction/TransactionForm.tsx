import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { CategorySelector } from "./CategorySelector";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [targetCreditCard, setTargetCreditCard] = useState("");
  
  // Filter sources based on type and category
  const filteredSources = formattedSources.filter(src => {
    if (category === "Credit Card Bill") {
      // For credit card bill payments, only show bank accounts and UPI
      return !src.name.toLowerCase().includes("credit");
    }
    return true;
  });

  // Get credit card sources for bill payment
  const creditCardSources = formattedSources.filter(src => 
    src.name.toLowerCase().includes("credit")
  );

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
        customCategories={customCategories}
        onAddCustomCategory={onAddCustomCategory}
      />
      <PaymentSourceSelector
        source={source}
        onSourceChange={onSourceChange}
        formattedSources={filteredSources}
      />
      
      {category === "Credit Card Bill" && creditCardSources.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Paying for</label>
          <Select value={targetCreditCard} onValueChange={setTargetCreditCard}>
            <SelectTrigger className="w-full h-14 border-gray-200 rounded-[12px]">
              <SelectValue placeholder="Select credit card to pay" />
            </SelectTrigger>
            <SelectContent>
              {creditCardSources.map((card) => (
                <SelectItem key={card.id} value={card.id}>
                  {card.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Input
        placeholder="Description or note (Optional)"
        className="h-14 border-gray-200 rounded-[12px]"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <Button
        className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-[12px]"
        onClick={onSubmit}
        disabled={category === "Credit Card Bill" && !targetCreditCard}
      >
        Add Transaction
      </Button>
    </div>
  );
};