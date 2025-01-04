import { toast } from "sonner";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionType } from "@/types/finance";
import { useTransactionValidation } from "./useTransactionValidation";

export const useTransactionSubmit = (onSuccess?: () => void) => {
  const { addTransaction, getFormattedPaymentSources, paymentSources } = useFinance();
  const { validateAmount, validatePaymentSource, validateExpenseBalance } = useTransactionValidation();

  const validateTransactionType = (type: TransactionType): boolean => {
    const validTypes: TransactionType[] = ["expense", "income", "transfer"];
    if (!validTypes.includes(type)) {
      toast.error("Invalid transaction type");
      return false;
    }
    return true;
  };

  const handleSubmit = async ({
    type,
    amount,
    category,
    source,
    destinationSource,
    description,
    selectedDate,
  }: {
    type: TransactionType;
    amount: string;
    category: string;
    source: string;
    destinationSource: string;
    description: string;
    selectedDate: Date;
  }) => {
    if (!validateTransactionType(type)) return false;

    if (!category) {
      toast.error("Please select a category");
      return false;
    }

    if (!source) {
      toast.error("Please select a payment source");
      return false;
    }

    if (type === "transfer" && !destinationSource) {
      toast.error("Please select a destination source");
      return false;
    }

    const validAmount = validateAmount(amount);
    if (!validAmount) return false;

    const sourceValidation = validatePaymentSource(source, paymentSources);
    if (!sourceValidation) return false;

    const { baseSourceId, baseSource } = sourceValidation;

    if (!validateExpenseBalance(baseSource, validAmount, type)) return false;

    const formattedSources = getFormattedPaymentSources();
    let displaySourceName = "";

    if (type === "transfer") {
      const destinationSourceObj = formattedSources.find(s => s.id === destinationSource);
      if (!destinationSourceObj) {
        toast.error("Invalid destination source");
        return false;
      }
      displaySourceName = destinationSourceObj.name;
    } else {
      const selectedSource = formattedSources.find(s => s.id === source);
      if (!selectedSource) {
        toast.error("Invalid payment source");
        return false;
      }
      displaySourceName = selectedSource.name;
    }

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

      onSuccess?.();
      toast.success("Transaction added successfully");
      return true;
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
      return false;
    }
  };

  return {
    handleSubmit,
  };
};