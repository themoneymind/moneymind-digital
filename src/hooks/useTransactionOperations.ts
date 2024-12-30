import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionType } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";
import { toast } from "sonner";
import { getBaseSourceId, updatePaymentSourceAmount } from "@/utils/paymentSourceUtils";

export const useTransactionOperations = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();

  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">
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

      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          ...transaction,
          base_source_id: baseSourceId,
          display_source: transaction.source, // Save the full source identifier
          user_id: user.id,
          date: new Date().toISOString(),
        });

      if (transactionError) throw transactionError;

      await refreshData();
      toast.success("Transaction added successfully");
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
      throw error;
    }
  };

  const editTransaction = async (
    id: string,
    updates: Partial<Omit<Transaction, "id" | "created_at" | "updated_at">>
  ) => {
    if (!user) return;

    try {
      const { data: originalTransaction, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // If the transaction is being rejected, reverse its effect on the payment source
      if (updates.status === 'rejected' && originalTransaction.status !== 'rejected') {
        await updatePaymentSourceAmount(
          originalTransaction.base_source_id,
          Number(originalTransaction.amount),
          originalTransaction.type as TransactionType,
          true
        );
      }
      // If a rejected transaction is being un-rejected, apply its effect
      else if (originalTransaction.status === 'rejected' && updates.status && updates.status !== 'rejected') {
        await updatePaymentSourceAmount(
          originalTransaction.base_source_id,
          Number(originalTransaction.amount),
          originalTransaction.type as TransactionType,
          false
        );
      }
      // For normal updates (not involving rejection)
      else if (updates.amount !== undefined && originalTransaction.status !== 'rejected') {
        await updatePaymentSourceAmount(
          originalTransaction.base_source_id,
          Number(originalTransaction.amount),
          originalTransaction.type as TransactionType,
          true
        );

        const baseSourceId = updates.source ? getBaseSourceId(updates.source) : originalTransaction.base_source_id;
        await updatePaymentSourceAmount(
          baseSourceId,
          Number(updates.amount),
          (updates.type || originalTransaction.type) as TransactionType,
          false
        );
      }

      // Convert Date to ISO string if it exists in updates
      const formattedUpdates = {
        ...updates,
        base_source_id: updates.source ? getBaseSourceId(updates.source) : undefined,
        display_source: updates.source || undefined,
        date: updates.date ? new Date(updates.date).toISOString() : undefined
      };

      const { error: updateError } = await supabase
        .from("transactions")
        .update(formattedUpdates)
        .eq("id", id);

      if (updateError) throw updateError;

      await refreshData();
      toast.success("Transaction updated successfully");
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      const { data: transaction, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Only reverse the payment source if the transaction wasn't rejected
      if (transaction.status !== 'rejected') {
        await updatePaymentSourceAmount(
          transaction.base_source_id,
          Number(transaction.amount),
          transaction.type as TransactionType,
          true
        );
      }

      const { error: deleteError } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await refreshData();
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
      throw error;
    }
  };

  return {
    addTransaction,
    editTransaction,
    deleteTransaction,
  };
};
