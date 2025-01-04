import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transactions";
import { toast } from "sonner";

export const useTransferOperation = (
  updatePaymentSourceAmount: (sourceId: string, amount: number, type: "income" | "expense" | "transfer", isReversal: boolean) => Promise<void>
) => {
  const handleTransfer = async (
    sourceBaseId: string,
    destinationBaseId: string | null,
    amount: number,
    userId: string,
    transactionData: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    console.log("Starting transfer operation:", {
      sourceBaseId,
      destinationBaseId,
      amount,
      transactionData
    });

    try {
      // Step 1: Debit source account
      await updatePaymentSourceAmount(
        sourceBaseId,
        amount,
        'expense',
        false
      );
      console.log("Source account debited successfully");

      // Step 2: Credit destination account if exists
      if (destinationBaseId) {
        await updatePaymentSourceAmount(
          destinationBaseId,
          amount,
          'income',
          false
        );
        console.log("Destination account credited successfully");
      }

      // Step 3: Create transfer record
      const { error: transferError } = await supabase
        .from("transactions")
        .insert([{
          ...transactionData,
          source: sourceBaseId,
          base_source_id: sourceBaseId,
          display_source: destinationBaseId,
          date: new Date().toISOString(),
          user_id: userId
        }]);

      if (transferError) {
        throw transferError;
      }

      console.log("Transfer record created successfully");
      return true;
    } catch (error) {
      console.error("Transfer operation failed:", error);
      
      // Rollback source debit
      await updatePaymentSourceAmount(
        sourceBaseId,
        amount,
        'income',
        true
      );
      console.log("Source debit rolled back");

      // Rollback destination credit if applicable
      if (destinationBaseId) {
        await updatePaymentSourceAmount(
          destinationBaseId,
          amount,
          'expense',
          true
        );
        console.log("Destination credit rolled back");
      }

      toast.error("Failed to process transfer");
      return false;
    }
  };

  return { handleTransfer };
};