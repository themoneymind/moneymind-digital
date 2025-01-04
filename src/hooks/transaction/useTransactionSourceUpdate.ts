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
      // For transfers, handle debit from source and credit to destination
      newAmount = isReversal
        ? Number(source.amount) + Number(amount)  // Reverse: Add back to source
        : Number(source.amount) - Number(amount); // Normal: Subtract from source
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

  const updateTransferDestination = async (
    destinationId: string,
    amount: number,
    isReversal: boolean = false
  ) => {
    const baseDestinationId = getBaseSourceId(destinationId);
    console.log("Updating transfer destination:", { destinationId, baseDestinationId, amount, isReversal });
    
    const destination = paymentSources.find(s => s.id === baseDestinationId);
    if (!destination) {
      console.error("Destination not found:", baseDestinationId);
      return;
    }

    // For transfer destination, add the amount (or subtract if reversing)
    const newAmount = isReversal
      ? Number(destination.amount) - Number(amount)  // Reverse: Remove from destination
      : Number(destination.amount) + Number(amount); // Normal: Add to destination

    console.log("New destination amount calculation:", {
      currentAmount: destination.amount,
      operation: isReversal ? "reverse" : "apply",
      change: amount,
      result: newAmount
    });

    const { error } = await supabase
      .from("payment_sources")
      .update({ amount: newAmount })
      .eq("id", baseDestinationId);

    if (error) {
      console.error("Error updating destination amount:", error);
      throw error;
    }
  };

  return { updatePaymentSourceAmount, updateTransferDestination };
};