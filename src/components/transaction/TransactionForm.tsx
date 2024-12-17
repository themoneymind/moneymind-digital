import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { CategorySelector } from "./CategorySelector";
import { PaymentSourceSelector } from "./PaymentSourceSelector";
import { useFinance } from "@/contexts/FinanceContext";
import { useState, useEffect } from "react";

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
  const { paymentSources } = useFinance();
  const [selectedCreditCard, setSelectedCreditCard] = useState("");
  const [creditCardSources, setCreditCardSources] = useState<{ id: string; name: string }[]>([]);
  const [bankSources, setBankSources] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Filter sources based on type
    const creditCards = formattedSources.filter(source => {
      const originalSource = paymentSources.find(s => s.id === source.id);
      return originalSource?.type === "credit";
    });
    const banks = formattedSources.filter(source => {
      const originalSource = paymentSources.find(s => s.id === source.id);
      return originalSource?.type !== "credit";
    });

    setCreditCardSources(creditCards);
    setBankSources(banks);
  }, [formattedSources, paymentSources]);

  const isCreditCardBill = category.toLowerCase() === "credit card bill";

  const handleCreditCardSelect = (cardId: string) => {
    setSelectedCreditCard(cardId);
    const card = paymentSources.find(s => s.id === cardId);
    if (card) {
      onAmountChange(card.amount.toString());
    }
  };

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
    "Credit Card Bill",
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
      
      {isCreditCardBill ? (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Credit Card</label>
            <PaymentSourceSelector
              source={selectedCreditCard}
              onSourceChange={handleCreditCardSelect}
              formattedSources={creditCardSources}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Source</label>
            <PaymentSourceSelector
              source={source}
              onSourceChange={onSourceChange}
              formattedSources={bankSources}
            />
          </div>
        </>
      ) : (
        <>
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
              expense: [...new Set([...defaultExpenseCategories, ...customCategories.expense])],
              income: [...new Set([...defaultIncomeCategories, ...customCategories.income])],
            }}
            onAddCustomCategory={onAddCustomCategory}
          />
          <PaymentSourceSelector
            source={source}
            onSourceChange={onSourceChange}
            formattedSources={formattedSources}
          />
        </>
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
      >
        Add Transaction
      </Button>
    </div>
  );
};