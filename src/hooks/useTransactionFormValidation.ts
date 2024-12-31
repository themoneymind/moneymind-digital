import { toast } from "sonner";
import { PaymentSource, TransactionType } from "@/types/finance";

export const useTransactionFormValidation = () => {
  const validateTransactionType = (type: TransactionType): boolean => {
    const validTypes: TransactionType[] = ["expense", "income", "transfer"];
    if (!validTypes.includes(type)) {
      toast.error("Invalid transaction type");
      return false;
    }
    return true;
  };

  const validateAmount = (amount: string): number | null => {
    const validAmount = Number(amount);
    if (!amount || isNaN(validAmount) || validAmount <= 0) {
      toast.error("Please enter a valid amount");
      return null;
    }
    return validAmount;
  };

  const validateCategory = (category: string, type: TransactionType): boolean => {
    if (!category && type !== 'transfer') {
      toast.error("Please select a category");
      return false;
    }
    return true;
  };

  const validateSource = (source: string): boolean => {
    if (!source) {
      toast.error("Please select a payment source");
      return false;
    }
    return true;
  };

  const validateExpenseBalance = (
    source: PaymentSource,
    amount: number,
    type: TransactionType
  ): boolean => {
    if (type === "expense" && source.amount < amount) {
      toast.error("Insufficient balance in selected source");
      return false;
    }
    return true;
  };

  return {
    validateTransactionType,
    validateAmount,
    validateCategory,
    validateSource,
    validateExpenseBalance,
  };
};