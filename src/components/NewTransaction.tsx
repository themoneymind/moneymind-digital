import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionType } from "@/types/finance";
import { TransactionForm } from "./transaction/TransactionForm";
import { useTransactionValidation } from "@/hooks/useTransactionValidation";
import { X } from "lucide-react";
import { toast } from "sonner";

type NewTransactionProps = {
  onClose: () => void;
};

export const NewTransaction = ({ onClose }: NewTransactionProps) => {
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

  const validateTransactionType = (type: TransactionType): boolean => {
    const validTypes: TransactionType[] = ["expense", "income", "transfer"];
    if (!validTypes.includes(type)) {
      toast.error("Invalid transaction type");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateTransactionType(type)) return;

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!source) {
      toast.error("Please select a payment source");
      return;
    }

    const validAmount = validateAmount(amount);
    if (!validAmount) return;

    const sourceValidation = validatePaymentSource(source, paymentSources);
    if (!sourceValidation) return;

    const { baseSourceId, baseSource } = sourceValidation;

    if (!validateExpenseBalance(baseSource, validAmount, type)) return;

    const selectedSource = formattedSources.find(s => s.id === source);
    if (!selectedSource) {
      toast.error("Invalid payment source");
      return;
    }

    try {
      await addTransaction({
        type,
        amount: validAmount,
        category,
        source: source,
        description,
        base_source_id: baseSourceId,
        display_source: selectedSource.name,
        date: selectedDate,
      });

      setAmount("");
      setCategory("");
      setSource("");
      setDescription("");
      setSelectedDate(new Date());
      onClose();
      toast.success("Transaction added successfully");
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
    }
  };

  return (
    <div className="bg-white rounded-t-[28px]">
      <div className="mx-auto h-2 w-[100px] rounded-full bg-gray-200 my-3" />
      <div className="px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold">New Transaction</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
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
    </div>
  );
};