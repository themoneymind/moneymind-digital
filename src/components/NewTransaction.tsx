import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionType } from "@/types/finance";
import { TransactionForm } from "./transaction/TransactionForm";
import { useTransactionValidation } from "@/hooks/useTransactionValidation";
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
    <div className="relative bg-white p-6 max-w-[320px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold">New Transaction</h2>
        <button 
          onClick={() => window.history.back()}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
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
  );
};