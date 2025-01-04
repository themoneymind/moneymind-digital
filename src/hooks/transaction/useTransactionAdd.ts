import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transactions";
import { toast } from "sonner";
import { useTransactionSourceUpdate } from "./useTransactionSourceUpdate";
import { PaymentSource } from "@/types/finance";

export const useTransactionAdd = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();
  const { updatePaymentSourceAmount } = useTransactionSourceUpdate(paymentSources);

  const addTransaction = async (newTransaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return;

    try {
      if (newTransaction.type === "transfer") {
        // For transfers, create a single transfer record
        const { error: transferError } = await supabase
          .from("transactions")
          .insert([{
            ...newTransaction,
            user_id: user.id,
            date: new Date().toISOString()
          }]);

        if (transferError) throw transferError;

        // Update source (debit)
        await updatePaymentSourceAmount(
          newTransaction.source,
          Number(newTransaction.amount),
          'expense',
          false
        );

        // Update destination (credit)
        await updatePaymentSourceAmount(
          newTransaction.display_source || '',
          Number(newTransaction.amount),
          'income',
          false
        );

      } else {
        // For regular income/expense transactions
        const { error: transactionError } = await supabase
          .from("transactions")
          .insert([{
            ...newTransaction,
            user_id: user.id,
            date: new Date().toISOString()
          }]);

        if (transactionError) throw transactionError;

        // Update source amount for income/expense
        await updatePaymentSourceAmount(
          newTransaction.source,
          Number(newTransaction.amount),
          newTransaction.type,
          false
        );
      }

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