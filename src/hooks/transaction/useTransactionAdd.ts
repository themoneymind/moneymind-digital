import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transactions";
import { toast } from "sonner";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";
import { useTransactionSourceUpdate } from "./useTransactionSourceUpdate";
import { PaymentSource } from "@/types/finance";

export const useTransactionAdd = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();
  const { updatePaymentSourceAmount } = useTransactionSourceUpdate(paymentSources);

  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    if (!user) return;

    try {
      const baseSourceId = getBaseSourceId(transaction.source);
      
      // Only update payment source if it's not a rejected transaction
      if (transaction.status !== 'rejected') {
        await updatePaymentSourceAmount(
          baseSourceId,
          Number(transaction.amount),
          transaction.type
        );
      }

      // Prepare the data for Supabase by converting Date to ISO string
      const { source, ...transactionData } = transaction;
      const supabaseData = {
        ...transactionData,
        date: transaction.date.toISOString(),
        base_source_id: baseSourceId,
        user_id: user.id,
      };

      const { error: transactionError } = await supabase
        .from("transactions")
        .insert(supabaseData);

      if (transactionError) throw transactionError;

      await refreshData();
      toast.success("Transaction added successfully");
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
      throw error;
    }
  };

  return { addTransaction };
};