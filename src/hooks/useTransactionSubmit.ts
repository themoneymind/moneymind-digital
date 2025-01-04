import { toast } from "sonner";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionType } from "@/types/finance";
import { useTransactionValidation } from "./useTransactionValidation";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

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
    console.log("Transaction submission - Input:", { type, amount, category, source, destinationSource });

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

    // Validate source
    const sourceValidation = validatePaymentSource(source, paymentSources);
    if (!sourceValidation) return false;

    const { baseSource } = sourceValidation;

    if (!validateExpenseBalance(baseSource, validAmount, type)) return false;

    // For transfers, validate destination source
    if (type === "transfer") {
      const destinationValidation = validatePaymentSource(destinationSource, paymentSources);
      if (!destinationValidation) return false;
    }

    const formattedSources = getFormattedPaymentSources();
    let displaySourceName = "";

    if (type === "transfer") {
      const destinationSourceObj = formattedSources.find(s => s.id === destinationSource);
      if (!destinationSourceObj) {
        toast.error("Invalid destination source");
        return false;
      }
      displaySourceName = destinationSourceObj.name;

      // First, create the debit transaction from source
      try {
        await addTransaction({
          type: "expense",
          amount: validAmount,
          category,
          source: source,
          description: `Transfer to ${displaySourceName}: ${description}`,
          base_source_id: getBaseSourceId(source),
          display_source: displaySourceName,
          date: selectedDate,
          reference_type: "transfer_debit",
        });

        // Then, create the credit transaction to destination
        await addTransaction({
          type: "income",
          amount: validAmount,
          category,
          source: destinationSource,
          description: `Transfer from ${formattedSources.find(s => s.id === source)?.name}: ${description}`,
          base_source_id: getBaseSourceId(destinationSource),
          display_source: formattedSources.find(s => s.id === source)?.name || "",
          date: selectedDate,
          reference_type: "transfer_credit",
        });

        onSuccess?.();
        toast.success("Transfer completed successfully");
        return true;
      } catch (error) {
        console.error("Error processing transfer:", error);
        toast.error("Failed to complete transfer");
        return false;
      }
    } else {
      // Handle regular income/expense transactions
      const selectedSource = formattedSources.find(s => s.id === source);
      if (!selectedSource) {
        toast.error("Invalid payment source");
        return false;
      }
      displaySourceName = selectedSource.name;

      try {
        await addTransaction({
          type,
          amount: validAmount,
          category,
          source: source,
          description,
          base_source_id: getBaseSourceId(source),
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
    }
  };

  return {
    handleSubmit,
  };
};