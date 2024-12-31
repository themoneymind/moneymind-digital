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

    // For transfers, we handle differently based on source type
    let newAmount;
    
    // If it's a credit card payment (transfer to credit card)
    if (source.type === 'credit' && type === 'expense') {
      // Credit card payments reduce the credit card balance
      newAmount = Number(source.amount) - Number(amount);
    }
    // For regular bank/UPI transfers
    else if (isTransfer) {
      if (type === 'expense') {
        // Source account (money going out)
        newAmount = Number(source.amount) - Number(amount);
      } else {
        // Destination account (money coming in)
        newAmount = Number(source.amount) + Number(amount);
      }
    }
    // For regular income/expense
    else {
      if (isReversal) {
        newAmount = type === 'income' 
          ? Number(source.amount) - Number(amount)
          : Number(source.amount) + Number(amount);
      } else {
        newAmount = type === 'income' 
          ? Number(source.amount) + Number(amount)
          : Number(source.amount) - Number(amount);
      }
    }

    console.log("New amount calculation:", {
      sourceType: source.type,
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