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
    console.log("Transfer Details:", {
      sourceBaseId,
      destinationBaseId,
      amount,
      transactionData,
      displaySource: transactionData.display_source,
      source: transactionData.source
    });

    try {
      // Step 1: Debit source account
      await updatePaymentSourceAmount(
        sourceBaseId,
        amount,
        'expense',
        false
      );
      console.log("Source account debited successfully:", {
        sourceId: sourceBaseId,
        amount: amount,
        remainingBalance: await getAccountBalance(sourceBaseId)
      });

      // Step 2: Credit destination account if exists
      if (destinationBaseId) {
        console.log("Attempting to credit destination:", {
          destinationId: destinationBaseId,
          originalBalance: await getAccountBalance(destinationBaseId)
        });

        await updatePaymentSourceAmount(
          destinationBaseId,
          amount,
          'income',
          false
        );

        console.log("Destination account credited:", {
          destinationId: destinationBaseId,
          newBalance: await getAccountBalance(destinationBaseId)
        });
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

  const getAccountBalance = async (accountId: string) => {
    const { data } = await supabase
      .from('payment_sources')
      .select('amount')
      .eq('id', accountId)
      .single();
    
    return data?.amount || 0;
  };

  return { handleTransfer };
};