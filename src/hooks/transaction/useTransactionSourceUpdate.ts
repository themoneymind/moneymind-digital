import { PaymentSource, TransactionType } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

export const useTransactionSourceUpdate = (paymentSources: PaymentSource[]) => {
  const updatePaymentSourceAmount = async (
    sourceId: string,
    amount: number,
    type: TransactionType,
    isReversal: boolean = false
  ) => {
    const baseSourceId = getBaseSourceId(sourceId);
    console.log("Updating payment source:", { sourceId, baseSourceId, amount, type, isReversal });
    
    const source = paymentSources.find(s => s.id === baseSourceId);
    if (!source) {
      console.error("Source not found:", baseSourceId);
      return;
    }

    let newAmount;
    if (type === "transfer") {
      // For transfers, we need to handle both source and destination
      if (isReversal) {
        newAmount = Number(source.amount) + Number(amount);
      } else {
        newAmount = Number(source.amount) - Number(amount);
      }
    } else {
      // For income and expense
      if (isReversal) {
        newAmount = type === "income" 
          ? Number(source.amount) - Number(amount)
          : Number(source.amount) + Number(amount);
      } else {
        newAmount = type === "income" 
          ? Number(source.amount) + Number(amount)
          : Number(source.amount) - Number(amount);
      }
    }

    console.log("New amount calculation:", {
      currentAmount: source.amount,
      operation: isReversal ? "reverse" : "apply",
      change: amount,
      result: newAmount
    });

    const { error } = await supabase
      .from("payment_sources")
      .update({ amount: newAmount })
      .eq("id", baseSourceId);

    if (error) {
      console.error("Error updating payment source amount:", error);
      throw error;
    }
  };

  return { updatePaymentSourceAmount };
};