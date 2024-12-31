import { PaymentSource, TransactionType } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

export const useTransactionSourceUpdate = (paymentSources: PaymentSource[]) => {
  const updatePaymentSourceAmount = async (
    sourceId: string,
    amount: number,
    type: TransactionType,
    isReversal: boolean = false,
    isTransfer: boolean = false
  ) => {
    const baseSourceId = getBaseSourceId(sourceId);
    console.log("Updating payment source:", { sourceId, baseSourceId, amount, type, isReversal, isTransfer });
    
    const source = paymentSources.find(s => s.id === baseSourceId);
    if (!source) {
      console.error("Source not found:", baseSourceId);
      return;
    }

    let newAmount;
    if (isTransfer) {
      // For transfers, we simply add or subtract based on whether it's the source or destination
      newAmount = type === "expense" 
        ? Number(source.amount) - Number(amount)  // Source account (money going out)
        : Number(source.amount) + Number(amount); // Destination account (money coming in)
    } else if (isReversal) {
      newAmount = type === "income" 
        ? Number(source.amount) - Number(amount)
        : Number(source.amount) + Number(amount);
    } else {
      newAmount = type === "income" 
        ? Number(source.amount) + Number(amount)
        : Number(source.amount) - Number(amount);
    }

    console.log("New amount calculation:", {
      currentAmount: source.amount,
      operation: isReversal ? "reverse" : isTransfer ? "transfer" : "apply",
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