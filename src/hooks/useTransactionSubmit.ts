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

    // For transfers, validate destination source
    if (type === "transfer") {
      const destinationValidation = validatePaymentSource(destinationSource, paymentSources);
      if (!destinationValidation) return false;

      const sourceType = baseSource.type;
      const destinationSourceObj = paymentSources.find(s => s.id === getBaseSourceId(destinationSource));
      const destinationType = destinationSourceObj?.type;

      // Handle bank to credit card transfer (bill payment)
      if (sourceType !== "Credit Card" && destinationType === "Credit Card") {
        try {
          // Create transfer entry in main transactions
          await addTransaction({
            type: "transfer",
            amount: validAmount,
            category,
            source: source,
            description: `Credit card payment to ${destinationSourceObj.name}: ${description}`,
            base_source_id: getBaseSourceId(source),
            display_source: destinationSourceObj.name,
            date: selectedDate,
            reference_type: "credit_card_payment",
          });

          // Create payment received entry for credit card
          await addTransaction({
            type: "income",
            amount: validAmount,
            category,
            source: destinationSource,
            description: `Payment received from ${baseSource.name}: ${description}`,
            base_source_id: getBaseSourceId(destinationSource),
            display_source: baseSource.name,
            date: selectedDate,
            reference_type: "credit_card_payment_received",
          });

          onSuccess?.();
          toast.success("Credit card payment completed successfully");
          return true;
        } catch (error) {
          console.error("Error processing credit card payment:", error);
          toast.error("Failed to complete credit card payment");
          return false;
        }
      }

      // Regular bank-to-bank transfer
      try {
        await addTransaction({
          type: "transfer",
          amount: validAmount,
          category,
          source: source,
          description,
          base_source_id: getBaseSourceId(source),
          display_source: destinationSourceObj?.name || "",
          date: selectedDate,
          reference_type: "bank_transfer",
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
      if (type === "income" && baseSource.type === "Credit Card") {
        toast.error("Cannot add direct income to credit cards");
        return false;
      }

      if (!validateExpenseBalance(baseSource, validAmount, type)) return false;

      try {
        await addTransaction({
          type,
          amount: validAmount,
          category,
          source: source,
          description,
          base_source_id: getBaseSourceId(source),
          display_source: baseSource.name,
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