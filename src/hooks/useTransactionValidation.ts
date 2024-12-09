import { useToast } from "@/hooks/use-toast";
import { PaymentSource } from "@/types/finance";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

export const useTransactionValidation = () => {
  const { toast } = useToast();

  const validateAmount = (amount: string) => {
    if (!amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return false;
    }

    return numAmount;
  };

  const validatePaymentSource = (
    source: string,
    paymentSources: PaymentSource[]
  ) => {
    if (!source) {
      toast({
        title: "Error",
        description: "Please select a payment source",
        variant: "destructive",
      });
      return null;
    }

    try {
      const baseSourceId = getBaseSourceId(source);
      console.log("Validating payment source:", {
        sourceId: source,
        baseSourceId,
        availableSources: paymentSources.map(s => ({ id: s.id, name: s.name }))
      });
      
      const baseSource = paymentSources.find(s => s.id === baseSourceId);
      console.log("Found base source:", baseSource);
      
      if (!baseSource) {
        toast({
          title: "Error",
          description: "Selected payment source not found",
          variant: "destructive",
        });
        return null;
      }

      return { baseSourceId, baseSource };
    } catch (error) {
      console.error("Error validating payment source:", error);
      toast({
        title: "Error",
        description: "Invalid payment source format",
        variant: "destructive",
      });
      return null;
    }
  };

  const validateExpenseBalance = (
    baseSource: PaymentSource,
    amount: number,
    type: "income" | "expense"
  ) => {
    if (type === "expense" && Number(baseSource.amount) < amount) {
      toast({
        title: "Error",
        description: "Insufficient balance in the selected payment source",
        variant: "destructive",
      });
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