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
      const cleanSourceId = getBaseSourceId(sourceBaseId);
      const cleanDestinationId = destinationBaseId ? getBaseSourceId(destinationBaseId) : null;

      if (!cleanDestinationId) {
        throw new Error("Destination account is required for transfer");
      }

      // Step 1: Debit source account
      await updatePaymentSourceAmount(
        cleanSourceId,
        amount,
        'expense',
        false
      );

      // Step 2: Credit destination account
      await updatePaymentSourceAmount(
        cleanDestinationId,
        amount,
        'income',
        false
      );

      // Step 3: Create outgoing transfer record
      const { error: outgoingError } = await supabase
        .from('transactions')
        .insert([{
          ...transaction,
          user_id: userId,
          source: cleanSourceId,
          base_source_id: cleanSourceId,
          display_source: cleanDestinationId,
          date: new Date().toISOString()
        }]);

      if (outgoingError) throw outgoingError;

      // Step 4: Create incoming transfer record
      const { error: incomingError } = await supabase
        .from('transactions')
        .insert([{
          ...transaction,
          user_id: userId,
          type: 'income',
          source: cleanDestinationId,
          base_source_id: cleanDestinationId,
          display_source: cleanSourceId,
          description: `Transfer from ${transaction.source}`,
          reference_type: 'transfer',
          reference_id: transaction.reference_id,
          date: new Date().toISOString()
        }]);

      if (incomingError) throw incomingError;

      return true;
    } catch (error) {
      // Rollback on failure
      try {
        const cleanSourceId = getBaseSourceId(sourceBaseId);
        const cleanDestinationId = destinationBaseId ? getBaseSourceId(destinationBaseId) : null;

        // Rollback source debit
        await updatePaymentSourceAmount(
          cleanSourceId,
          amount,
          'income',
          true
        );

        // Rollback destination credit if applicable
        if (cleanDestinationId) {
          await updatePaymentSourceAmount(
            cleanDestinationId,
            amount,
            'expense',
            true
          );
        }
      } catch (rollbackError) {
        toast.error("Critical error during rollback. Please contact support.");
      }

      toast.error("Failed to complete transfer");
      throw error;
    }
  };

  return { handleTransfer };
};