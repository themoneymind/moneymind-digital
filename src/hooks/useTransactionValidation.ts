import { PaymentSource, TransactionType } from "@/types/finance";
import { toast } from "sonner";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

export const useTransactionValidation = () => {
  const validateAmount = (amount: string): number | false => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return false;
    }
    return numAmount;
  };

  const validatePaymentSource = (
    sourceId: string,
    paymentSources: PaymentSource[]
  ): { baseSource: PaymentSource } | false => {
    // Extract base ID (removes UPI app suffix if present)
    const baseSourceId = getBaseSourceId(sourceId);
    console.log("Validating source:", { sourceId, baseSourceId });
    
    const baseSource = paymentSources.find(s => s.id === baseSourceId);
    
    if (!baseSource) {
      toast.error("Invalid payment source");
      return false;
    }

    return { baseSource };
  };

  const validateExpenseBalance = (
    source: PaymentSource,
    amount: number,
    type: TransactionType
  ): boolean => {
    if (type === "expense") {
      const availableBalance = source.type === "Credit Card"
        ? (source.credit_limit || 0) - (source.amount || 0)
        : source.amount || 0;

      if (availableBalance < amount) {
        toast.error("Insufficient balance in selected payment source");
        return false;
      }
    } else if (type === "transfer") {
      // For transfers, check if source account has sufficient balance
      if (source.amount < amount) {
        toast.error("Insufficient balance for transfer in source account");
        return false;
      }
    }
    return true;
  };

  return {
    validateAmount,
    validatePaymentSource,
    validateExpenseBalance,
  };
};