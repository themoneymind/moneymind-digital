import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transactions";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";
import { toast } from "sonner";

export const useTransferOperation = (
  updatePaymentSourceAmount: (
    sourceId: string,
    amount: number,
    type: "income" | "expense" | "transfer",
    isReversal?: boolean
  ) => Promise<void>
) => {
  const handleTransfer = async (
    sourceBaseId: string,
    destinationBaseId: string | null,
    amount: number,
    userId: string,
    transaction: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    try {
      // Clean the source and destination IDs
      const cleanSourceId = getBaseSourceId(sourceBaseId);
      const cleanDestinationId = destinationBaseId ? getBaseSourceId(destinationBaseId) : null;

      console.log("Starting transfer operation with clean IDs:", {
        sourceId: cleanSourceId,
        destinationId: cleanDestinationId,
        originalSourceId: sourceBaseId,
        originalDestinationId: destinationBaseId,
        amount
      });

      // Step 1: Debit source account
      await updatePaymentSourceAmount(
        cleanSourceId,
        amount,
        'expense',
        false
      );
      const sourceBalance = await getAccountBalance(cleanSourceId);
      console.log("Source account debited successfully:", {
        sourceId: cleanSourceId,
        amount: amount,
        remainingBalance: sourceBalance
      });

      // Step 2: Credit destination account if exists
      if (cleanDestinationId) {
        const originalBalance = await getAccountBalance(cleanDestinationId);
        console.log("Attempting to credit destination:", {
          destinationId: cleanDestinationId,
          originalBalance: originalBalance
        });

        await updatePaymentSourceAmount(
          cleanDestinationId,
          amount,
          'income',
          false
        );

        const newBalance = await getAccountBalance(cleanDestinationId);
        console.log("Destination account credited:", {
          destinationId: cleanDestinationId,
          newBalance: newBalance
        });
      }

      // Step 3: Create the transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          ...transaction,
          user_id: userId,
          source: cleanSourceId,
          base_source_id: cleanSourceId,
          display_source: transaction.display_source || cleanSourceId,
          date: new Date().toISOString()
        }]);

      if (transactionError) {
        console.error("Error creating transaction:", transactionError);
        throw new Error("Failed to create transaction record");
      }

      // If this is a transfer, create the corresponding incoming transaction
      if (transaction.type === 'transfer' && cleanDestinationId) {
        const incomingTransaction = {
          ...transaction,
          user_id: userId,
          type: 'income',
          source: cleanDestinationId,
          base_source_id: cleanDestinationId,
          display_source: cleanDestinationId,
          description: `Transfer from ${transaction.source}`,
          reference_type: 'transfer',
          reference_id: transaction.reference_id,
          date: new Date().toISOString()
        };

        const { error: incomingError } = await supabase
          .from('transactions')
          .insert([incomingTransaction]);

        if (incomingError) {
          console.error("Error creating incoming transaction:", incomingError);
          throw new Error("Failed to create incoming transaction record");
        }
      }

      return true;
    } catch (error) {
      console.error("Transfer operation failed:", error);
      
      // Attempt to rollback the transfer
      try {
        // Rollback source debit
        const cleanSourceId = getBaseSourceId(sourceBaseId);
        await updatePaymentSourceAmount(
          cleanSourceId,
          amount,
          'income',
          true
        );
        console.log("Source debit rolled back");

        // Rollback destination credit if applicable
        if (destinationBaseId) {
          const cleanDestinationId = getBaseSourceId(destinationBaseId);
          await updatePaymentSourceAmount(
            cleanDestinationId,
            amount,
            'expense',
            true
          );
          console.log("Destination credit rolled back");
        }
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }

      toast.error("Failed to complete transfer");
      throw error;
    }
  };

  const getAccountBalance = async (accountId: string) => {
    if (!accountId || typeof accountId !== 'string' || !accountId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.error("Invalid account ID format:", accountId);
      return 0;
    }

    try {
      const { data, error } = await supabase
        .from('payment_sources')
        .select('amount')
        .eq('id', accountId)
        .single();

      if (error) {
        console.error("Error fetching account balance:", error);
        return 0;
      }

      return data?.amount || 0;
    } catch (error) {
      console.error("Error in getAccountBalance:", error);
      return 0;
    }
  };

  return { handleTransfer };
};