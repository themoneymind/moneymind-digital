import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { PaymentSource } from "@/types/finance";

export const usePaymentSourceOperations = (
  source: PaymentSource | undefined,
  onSuccess: () => void
) => {
  const { editPaymentSource } = useFinance();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameAndUpiChange = async (name: string, upiApps: string[]) => {
    if (!source) return;

    setIsSubmitting(true);
    try {
      await editPaymentSource({
        ...source,
        name,
        linked: upiApps.length > 0,
        upi_apps: upiApps.length > 0 ? upiApps : undefined,
      });
      onSuccess();
    } catch (error) {
      console.error("Error updating payment source:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleNameAndUpiChange,
  };
};