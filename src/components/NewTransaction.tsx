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
    
    const selectedSource = formattedSources.find(s => s.id === source);
    if (!selectedSource) {
      toast.error("Invalid payment source");
      return;
    }

    const baseSource = paymentSources.find(s => s.id === source);
    if (!baseSource) {
      toast.error("Payment source not found");
      return;
    }

    if (type !== 'transfer' && !validateExpenseBalance(baseSource, validAmount, type)) return;

    try {
      if (type === 'transfer') {
        const fromSource = formattedSources.find(s => s.id === source);
        const toSource = formattedSources.find(s => s.id === source); // This will be updated with destinationSource
        
        if (!fromSource || !toSource) {
          toast.error("Invalid source or destination");
          return;
        }

        await handleTransfer(
          source,
          source, // Will be updated with destinationSource
          validAmount,
          description,
          selectedDate,
          fromSource.name,
          toSource.name
        );
      } else {
        const transactionType = type as Exclude<TransactionType, "transfer">;
        await addTransaction({
          type: transactionType,
          amount: validAmount,
          category: category,
          source: source,
          base_source_id: source,
          description,
          date: selectedDate,
        });
      }

      resetForm();
      onClose();
      toast.success("Transaction added successfully");
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Failed to add transaction");
    }
  };

  const handleSourceChange = (newSource: string, destinationSource?: string) => {
    setSource(newSource);
    if (type === 'transfer' && destinationSource) {
      // Update the source to be the destination for the transfer
      setSource(destinationSource);
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
        onSourceChange={handleSourceChange}
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