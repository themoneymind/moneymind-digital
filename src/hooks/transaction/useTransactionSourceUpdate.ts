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
    console.log("Transfer Debug - Starting source update:", { 
      sourceId, 
      baseSourceId, 
      amount, 
      type, 
      isReversal, 
      isTransfer 
    });
    
    const source = paymentSources.find(s => s.id === baseSourceId);
    if (!source) {
      console.error("Transfer Debug - Source not found:", baseSourceId);
      return;
    }

    console.log("Transfer Debug - Found source:", source);

    let newAmount;
    
    // Handle transfers specifically
    if (isTransfer) {
      if (type === 'transfer') {
        // For transfer type, we simply subtract from source and add to destination
        newAmount = type === 'expense' 
          ? Number(source.amount) - Number(amount)  // Source account (money going out)
          : Number(source.amount) + Number(amount); // Destination account (money coming in)
        
        console.log("Transfer Debug - Transfer calculation:", {
          sourceType: source.type,
          operation: type === 'expense' ? 'debit' : 'credit',
          currentAmount: source.amount,
          changeAmount: amount,
          newAmount
        });
      }
    }
    // Handle credit card payments
    else if (source.type === 'credit' && type === 'expense') {
      newAmount = Number(source.amount) - Number(amount);
      console.log("Transfer Debug - Credit card payment:", {
        currentAmount: source.amount,
        deductAmount: amount,
        newAmount
      });
    }
    // Handle regular income/expense
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

    console.log("Transfer Debug - Final amount calculation:", {
      sourceType: source.type,
      currentAmount: source.amount,
      operation: isReversal ? "reverse" : isTransfer ? "transfer" : "apply",
      change: amount,
      result: newAmount,
      calculationType: isTransfer ? (type === 'expense' ? 'debit' : 'credit') : type
    });

    const { data, error } = await supabase
      .from("payment_sources")
      .update({ amount: newAmount })
      .eq("id", baseSourceId)
      .select();

    if (error) {
      console.error("Transfer Debug - Error updating payment source amount:", error);
      throw error;
    }

    console.log("Transfer Debug - Update successful:", data);
  };

  return { updatePaymentSourceAmount };
};