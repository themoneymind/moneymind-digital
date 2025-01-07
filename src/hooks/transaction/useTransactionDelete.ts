import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTransactionSourceUpdate } from "./useTransactionSourceUpdate";
import { PaymentSource, TransactionType } from "@/types/finance";

export const useTransactionDelete = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();
  const { updatePaymentSourceAmount } = useTransactionSourceUpdate(paymentSources);

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
          transaction.source,
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

  return { deleteTransaction };
};