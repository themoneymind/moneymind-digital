import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionType } from "@/types/transactions";
import { toast } from "sonner";

export const useRegularTransaction = (
  updatePaymentSourceAmount: (sourceId: string, amount: number, type: TransactionType, isReversal: boolean) => Promise<void>
) => {
  const handleRegularTransaction = async (
    sourceBaseId: string,
    amount: number,
    type: TransactionType,
    userId: string,
    transactionData: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    console.log("Starting regular transaction:", {
      sourceBaseId,
      amount,
      type,
      transactionData
    });

    try {
      // Step 1: Update source amount
      await updatePaymentSourceAmount(
        sourceBaseId,
        amount,
        type,
        false
      );
      console.log("Source amount updated successfully");

      // Step 2: Create transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert([{
          ...transactionData,
          source: sourceBaseId,
          base_source_id: sourceBaseId,
          date: new Date().toISOString(),
          user_id: userId
        }]);

      if (transactionError) {
        throw transactionError;
      }

      console.log("Transaction record created successfully");
      return true;
    } catch (error) {
      console.error("Regular transaction failed:", error);
      
      // Rollback amount update
      await updatePaymentSourceAmount(
        sourceBaseId,
        amount,
        type === 'income' ? 'expense' : 'income',
        true
      );
      console.log("Amount update rolled back");

      toast.error("Failed to process transaction");
      return false;
    }
  };

  return { handleRegularTransaction };
};