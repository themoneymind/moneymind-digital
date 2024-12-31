import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionType } from "@/types/finance";
import { TransactionForm } from "./transaction/TransactionForm";
import { useTransactionValidation } from "@/hooks/useTransactionValidation";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

export const NewTransaction = () => {
  const { addTransaction, getFormattedPaymentSources, paymentSources } = useFinance();
  const { validateAmount, validatePaymentSource, validateExpenseBalance } = useTransactionValidation();
  
  const [type, setType] = useState<TransactionType | "transfer">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [toSource, setToSource] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customCategories, setCustomCategories] = useState<{
    expense: string[];
    income: string[];
  }>({
    expense: [],
    income: [],
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

    if (type === "transfer") {
      if (!source || !toSource) {
        console.error("Source and destination accounts are required for transfers");
        return;
      }

      const sourceValidation = validatePaymentSource(source, paymentSources);
      const destValidation = validatePaymentSource(toSource, paymentSources);
      
      if (!sourceValidation || !destValidation) return;

      const { baseSource } = sourceValidation;
      if (!validateExpenseBalance(baseSource, validAmount, "expense")) return;

      try {
        // Create the transfer-out transaction
        await addTransaction({
          type: "expense",
          amount: validAmount,
          category: "Transfer",
          source: source,
          description: `Transfer to ${formattedSources.find(s => s.id === toSource)?.name}`,
          base_source_id: sourceValidation.baseSourceId,
          display_source: formattedSources.find(s => s.id === source)?.name,
          date: selectedDate,
          reference_type: "transfer",
        });

        // Create the transfer-in transaction
        await addTransaction({
          type: "income",
          amount: validAmount,
          category: "Transfer",
          source: toSource,
          description: `Transfer from ${formattedSources.find(s => s.id === source)?.name}`,
          base_source_id: destValidation.baseSourceId,
          display_source: formattedSources.find(s => s.id === toSource)?.name,
          date: selectedDate,
          reference_type: "transfer",
        });

        // Reset form after successful submission
        setAmount("");
        setCategory("");
        setSource("");
        setToSource("");
        setDescription("");
        setSelectedDate(new Date());
      } catch (error) {
        console.error("Error adding transfer:", error);
      }
      return;
    }

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
    <div className="p-6 mx-4 bg-white rounded-[20px]">
      <h2 className="mb-6 text-base font-semibold">New Transaction</h2>
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
        toSource={toSource}
        onToSourceChange={setToSource}
      />
    </div>
  );
};