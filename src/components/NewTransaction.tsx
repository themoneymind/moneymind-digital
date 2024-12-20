import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionType } from "@/types/finance";
import { TransactionForm } from "./transaction/TransactionForm";
import { useTransactionValidation } from "@/hooks/useTransactionValidation";

export const NewTransaction = () => {
  const { addTransaction, getFormattedPaymentSources, paymentSources } = useFinance();
  const { validateAmount, validatePaymentSource, validateExpenseBalance } = useTransactionValidation();
  
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [customCategories, setCustomCategories] = useState<{
    expense: string[];
    income: string[];
  }>({
    expense: [],
    income: [],
  });

  const formattedSources = getFormattedPaymentSources();
  console.log("Available formatted sources:", formattedSources);

  const handleAddCustomCategory = (newCategory: string) => {
    setCustomCategories((prev) => ({
      ...prev,
      [type]: [...prev[type], newCategory],
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting transaction with source:", source);
    
    const validAmount = validateAmount(amount);
    if (!validAmount) return;

    const sourceValidation = validatePaymentSource(source, paymentSources);
    if (!sourceValidation) return;

    const { baseSourceId, baseSource } = sourceValidation;

    if (!validateExpenseBalance(baseSource, validAmount, type)) return;

    try {
      await addTransaction({
        type,
        amount: validAmount,
        category,
        source: baseSourceId,
        description,
      });

      // Reset form after successful submission
      setAmount("");
      setCategory("");
      setSource("");
      setDescription("");
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <div className="p-6 mx-4 bg-white rounded-[20px]">
      <h2 className="mb-6 text-base font-semibold">New Transaction</h2>
      <TransactionForm
        type={type}
        amount={amount}
        category={category}
        source={source}
        description={description}
        onTypeChange={setType}
        onAmountChange={setAmount}
        onCategoryChange={setCategory}
        onSourceChange={setSource}
        onDescriptionChange={setDescription}
        onSubmit={handleSubmit}
        customCategories={customCategories}
        onAddCustomCategory={handleAddCustomCategory}
        formattedSources={formattedSources}
      />
    </div>
  );
};