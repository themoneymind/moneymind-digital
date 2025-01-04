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
    console.log("Updating payment source:", { 
      sourceId, 
      baseSourceId, 
      amount, 
      type, 
      isReversal,
      paymentSourcesCount: paymentSources.length 
    });
    
    const source = paymentSources.find(s => s.id === baseSourceId);
    if (!source) {
      console.error("Source not found:", baseSourceId);
      console.log("Available sources:", paymentSources.map(s => ({ id: s.id, name: s.name })));
      throw new Error(`Payment source not found: ${baseSourceId}`);
    }

    console.log("Found source:", { 
      sourceName: source.name, 
      currentAmount: source.amount,
      sourceType: source.type 
    });

    let newAmount;
    if (isReversal) {
      newAmount = type === "income" 
        ? Number(source.amount) - Number(amount)
        : Number(source.amount) + Number(amount);
    } else {
      newAmount = type === "income" 
        ? Number(source.amount) + Number(amount)
        : Number(source.amount) - Number(amount);
    }

    console.log("Amount calculation:", {
      currentAmount: source.amount,
      operation: isReversal ? "reverse" : "apply",
      change: amount,
      result: newAmount,
      sourceType: source.type
    });

    const { error } = await supabase
      .from("payment_sources")
      .update({ amount: newAmount })
      .eq("id", baseSourceId);

    if (error) {
      console.error("Error updating payment source amount:", error);
      throw error;
    }

    console.log("Successfully updated payment source amount");
  };

  return { updatePaymentSourceAmount };
};