import { useState } from "react";
import { PaymentSource } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useFinance } from "@/contexts/FinanceContext";

export const usePaymentSourceOperations = (
  source: PaymentSource | undefined,
  onSuccess: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { refreshData } = useFinance();

  const handleAmountChange = async (
    operation: "add" | "subtract",
    amount: string,
    name?: string,
    upiApps?: string[]
  ) => {
    if (!source) return;

    try {
      setIsSubmitting(true);
      const numAmount = Number(amount);
      
      if (isNaN(numAmount)) {
        throw new Error("Invalid amount");
      }

      const currentAmount = Number(source.amount) || 0;
      const newAmount = operation === "add" 
        ? currentAmount + numAmount 
        : currentAmount - numAmount;

      if (newAmount < 0) {
        toast({
          title: "Error",
          description: "Amount cannot be negative",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("payment_sources")
        .update({
          amount: newAmount,
          name: name || source.name,
          upi_apps: upiApps || source.upi_apps
        })
        .eq("id", source.id);

      if (error) throw error;

      await refreshData();

      toast({
        title: "Success",
        description: "Amount updated successfully",
      });

      onSuccess();
    } catch (error) {
      console.error("Error updating amount:", error);
      toast({
        title: "Error",
        description: "Failed to update amount",
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