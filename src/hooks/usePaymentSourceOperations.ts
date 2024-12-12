import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentSource } from "@/types/finance";
import { useTransactions } from "@/hooks/useTransactions";

export const usePaymentSourceOperations = (
  source: PaymentSource | undefined,
  onClose: () => void
) => {
  const { editPaymentSource, refreshData } = useFinance();
  const { addTransaction } = useTransactions();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = async (
    operation: "add" | "subtract",
    amount: string,
    name: string,
    selectedUpiApps: string[]
  ) => {
    if (!source || !amount.trim() || isNaN(Number(amount))) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const numAmount = Number(amount);
    if (operation === "subtract" && numAmount > source.amount) {
      toast({
        title: "Error",
        description: "Cannot subtract more than the available balance",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newAmount = operation === "add" 
        ? source.amount + numAmount 
        : source.amount - numAmount;

      // First update the payment source
      await editPaymentSource({
        ...source,
        amount: newAmount,
        name: name.trim(),
        linked: selectedUpiApps.length > 0,
        upi_apps: selectedUpiApps.length > 0 ? selectedUpiApps : undefined,
      });

      // Then create a transaction record
      await addTransaction({
        type: "income",
        amount: numAmount,
        category: "Bank Transfer",
        source: source.id,
        description: `${operation === 'add' ? 'Added' : 'Subtracted'} ${amount} ${operation === 'add' ? 'to' : 'from'} ${name}`,
      });

      await refreshData();

      toast({
        title: "Success",
        description: `Amount ${operation}ed ${operation === 'add' ? 'to' : 'from'} ${name}`,
      });

      onClose();
    } catch (error) {
      console.error("Error updating payment source:", error);
      toast({
        title: "Error",
        description: "Failed to update payment source",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleAmountChange,
  };
};