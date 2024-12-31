import { PaymentSource, TransactionType } from "@/types/finance";
import { toast } from "sonner";

export const useTransactionValidation = () => {
  const validateAmount = (amount: string) => {
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return null;
    }
    return numAmount;
  };

  const validatePaymentSource = (sourceId: string, paymentSources: PaymentSource[]) => {
    if (!sourceId) {
      toast.error("Please select a payment source");
      return null;
    }

    const baseSource = paymentSources.find(s => s.id === sourceId);
    if (!baseSource) {
      toast.error("Invalid payment source");
      return null;
    }

    return {
      baseSourceId: sourceId,
      baseSource,
    };
  };

  const validateExpenseBalance = (source: PaymentSource, amount: number, type: TransactionType) => {
    if (type === "transfer") return true;
    
    if (type === "expense") {
      const availableBalance = source.type === "credit" 
        ? (source.credit_limit || 0) - (source.amount || 0)
        : source.amount || 0;

      if (availableBalance < amount) {
        toast.error("Insufficient balance in selected account");
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