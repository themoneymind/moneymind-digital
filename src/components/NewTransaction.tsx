import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionType } from "@/types/finance";
import { TransactionForm } from "./transaction/TransactionForm";
import { useTransactionValidation } from "@/hooks/useTransactionValidation";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";
import { X } from "lucide-react";

export const NewTransaction = () => {
  const { addTransaction, getFormattedPaymentSources, paymentSources } = useFinance();
  const { validateAmount, validatePaymentSource, validateExpenseBalance } = useTransactionValidation();
  
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customCategories, setCustomCategories] = useState<{
    expense: string[];
    income: string[];
    transfer: string[];
  }>({
    expense: [],
    income: [],
    transfer: [],
  });

  const formattedSources = getFormattedPaymentSources();

  const handleAddCustomCategory = (newCategory: string) => {
    setCustomCategories((prev) => ({
      ...prev,
      [type]: [...prev[type], newCategory],
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting transaction with date:", selectedDate);
    
    const validAmount = validateAmount(amount);
    if (!validAmount) return;

    const sourceValidation = validatePaymentSource(source, paymentSources);
    if (!sourceValidation) return;

    const { baseSourceId, baseSource } = sourceValidation;

    if (!validateExpenseBalance(baseSource, validAmount, type)) return;

    const selectedSource = formattedSources.find(s => s.id === source);
    const displaySourceName = selectedSource ? selectedSource.name : source;

    try {
      await addTransaction({
        type,
        amount: validAmount,
        category,
        source: source,
        description,
        base_source_id: baseSourceId,
        display_source: displaySourceName,
        date: selectedDate,
      });

      // Reset form after successful submission
      setAmount("");
      setCategory("");
      setSource("");
      setDescription("");
      setSelectedDate(new Date());
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-[400px] bg-white rounded-[20px] p-6">
        <button
          onClick={() => window.history.back()}
          className="absolute right-4 top-4 p-2 text-[#ea384c] hover:bg-red-50 rounded-full transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-base font-semibold mb-6">New Transaction</h2>
        <TransactionForm
          type={type}
          amount={amount}
          category={category}
          source={source}
          description={description}
          selectedDate={selectedDate}
          onTypeChange={setType}
          onAmountChange={setAmount}
          onCategoryChange={setCategory}
          onSourceChange={setSource}
          onDescriptionChange={setDescription}
          onDateChange={setSelectedDate}
          onSubmit={handleSubmit}
          customCategories={customCategories}
          onAddCustomCategory={handleAddCustomCategory}
          formattedSources={formattedSources}
        />
      </div>
    </div>
  );
};