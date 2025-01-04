import { PaymentSource, TransactionType } from "@/types/finance";
import { toast } from "sonner";

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
  ): { baseSourceId: string; baseSource: PaymentSource } | false => {
    const baseSourceId = sourceId.split('-')[0];
    const baseSource = paymentSources.find(s => s.id === baseSourceId);
    
    if (!baseSource) {
      toast.error("Invalid payment source");
      return false;
    }

    return { baseSourceId, baseSource };
  };

  const validateExpenseBalance = (
    source: PaymentSource,
    amount: number,
    type: TransactionType
  ): boolean => {
    if (type === "expense" && source.amount < amount) {
      toast.error("Insufficient balance in selected payment source");
      return false;
    }
    return true;
  };

  return {
    validateAmount,
    validatePaymentSource,
    validateExpenseBalance,
  };
};