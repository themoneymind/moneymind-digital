import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transactions";
import { toast } from "sonner";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";
import { useTransactionSourceUpdate } from "./useTransactionSourceUpdate";
import { PaymentSource, TransactionType } from "@/types/finance";

export const useTransactionEdit = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();
  const { updatePaymentSourceAmount } = useTransactionSourceUpdate(paymentSources);

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
        if (originalTransaction.type === 'transfer') {
          await updatePaymentSourceAmount(
            originalTransaction.source,
            Number(originalTransaction.amount),
            'expense',
            true,
            true
          );
          await updatePaymentSourceAmount(
            originalTransaction.display_source,
            Number(originalTransaction.amount),
            'income',
            true,
            true
          );
        } else {
          await updatePaymentSourceAmount(
            originalTransaction.source,
            Number(originalTransaction.amount),
            originalTransaction.type as TransactionType,
            true
          );
        }
      }
      // If a rejected transaction is being un-rejected, apply its effect
      else if (originalTransaction.status === 'rejected' && updates.status && updates.status !== 'rejected') {
        if (originalTransaction.type === 'transfer') {
          await updatePaymentSourceAmount(
            originalTransaction.source,
            Number(originalTransaction.amount),
            'expense',
            false,
            true
          );
          await updatePaymentSourceAmount(
            originalTransaction.display_source,
            Number(originalTransaction.amount),
            'income',
            false,
            true
          );
        } else {
          await updatePaymentSourceAmount(
            originalTransaction.source,
            Number(originalTransaction.amount),
            originalTransaction.type as TransactionType,
            false
          );
        }
      }
      // For normal updates (not involving rejection)
      else if (updates.amount !== undefined && originalTransaction.status !== 'rejected') {
        if (originalTransaction.type === 'transfer') {
          // Reverse old amounts
          await updatePaymentSourceAmount(
            originalTransaction.source,
            Number(originalTransaction.amount),
            'expense',
            true,
            true
          );
          await updatePaymentSourceAmount(
            originalTransaction.display_source,
            Number(originalTransaction.amount),
            'income',
            true,
            true
          );

          // Apply new amounts
          const targetSource = updates.source || originalTransaction.source;
          const destinationSource = updates.display_source || originalTransaction.display_source;
          
          await updatePaymentSourceAmount(
            targetSource,
            Number(updates.amount),
            'expense',
            false,
            true
          );
          await updatePaymentSourceAmount(
            destinationSource,
            Number(updates.amount),
            'income',
            false,
            true
          );
        } else {
          // For non-transfer transactions
          await updatePaymentSourceAmount(
            originalTransaction.source,
            Number(originalTransaction.amount),
            originalTransaction.type as TransactionType,
            true
          );

          const targetSource = updates.source || originalTransaction.source;
          await updatePaymentSourceAmount(
            targetSource,
            Number(updates.amount),
            (updates.type || originalTransaction.type) as TransactionType,
            false
          );
        }
      }

      // Prepare the data for Supabase update
      const { source, date, ...updateData } = updates;
      const supabaseData = {
        ...updateData,
        date: date instanceof Date ? date.toISOString() : date,
        base_source_id: updates.source ? getBaseSourceId(updates.source) : undefined,
      };

      const { error: updateError } = await supabase
        .from("transactions")
        .update(supabaseData)
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

  return { editTransaction };
};