import { useFinance } from "@/contexts/FinanceContext";
import { TransactionType } from "@/types/finance";
import { TransactionForm } from "./transaction/TransactionForm";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useTransactionFormState } from "@/hooks/useTransactionFormState";
import { useTransactionFormValidation } from "@/hooks/useTransactionFormValidation";
import { useTransferHandling } from "@/hooks/useTransferHandling";

type NewTransactionProps = {
  onClose: () => void;
};

export const NewTransaction = ({ onClose }: NewTransactionProps) => {
  const { getFormattedPaymentSources, paymentSources, addTransaction } = useFinance();
  const formattedSources = getFormattedPaymentSources();
  const { handleTransfer } = useTransferHandling();
  const {
    validateTransactionType,
    validateAmount,
    validateCategory,
    validateSource,
    validateExpenseBalance,
  } = useTransactionFormValidation();

  const {
    type,
    setType,
    amount,
    setAmount,
    category,
    setCategory,
    source,
    setSource,
    description,
    setDescription,
    selectedDate,
    setSelectedDate,
    customCategories,
    setCustomCategories,
    resetForm,
  } = useTransactionFormState();

  const handleAddCustomCategory = (newCategory: string) => {
    setCustomCategories((prev) => ({
      ...prev,
      [type]: [...prev[type], newCategory],
    }));
  };

  const handleSubmit = async () => {
    if (!validateTransactionType(type)) return;
    if (!validateCategory(category, type)) return;
    if (!validateSource(source)) return;

    const validAmount = validateAmount(amount);
    if (!validAmount) return;

    // Find the selected source from formatted sources
    const selectedSource = formattedSources.find(s => s.id === source);
    if (!selectedSource) {
      toast.error("Invalid payment source");
      return;
    }

    // Get the base source ID (without UPI app suffix if present)
    const baseSourceId = source.split('-')[0];
    const baseSource = paymentSources.find(s => s.id === baseSourceId);
    if (!baseSource) {
      toast.error("Payment source not found");
      return;
    }

    if (type !== 'transfer' && !validateExpenseBalance(baseSource, validAmount, type)) return;

    try {
      if (type === 'transfer') {
        await handleTransfer(
          baseSourceId,
          source,
          validAmount,
          description,
          selectedDate,
          baseSource.name,
          selectedSource.name
        );
      } else {
        const transactionType = type as Exclude<TransactionType, "transfer">;
        await addTransaction({
          type: transactionType,
          amount: validAmount,
          category,
          source,
          base_source_id: baseSourceId,
          description,
          date: selectedDate,
        });
      }

      resetForm();
      onClose();
      toast.success("Transaction added successfully");
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold">New Transaction</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
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
    </>
  );
};