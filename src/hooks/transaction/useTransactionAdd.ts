import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transactions";
import { toast } from "sonner";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";
import { useTransactionSourceUpdate } from "./useTransactionSourceUpdate";
import { PaymentSource } from "@/types/finance";
import { useAuth } from "@/contexts/AuthContext";

export const useTransactionAdd = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();
  const { updatePaymentSourceAmount } = useTransactionSourceUpdate(paymentSources);

  const addTransaction = async (newTransaction: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return;

    try {
      // Get base source IDs for both source and destination
      const sourceBaseId = getBaseSourceId(newTransaction.source);
      const destinationBaseId = newTransaction.display_source ? getBaseSourceId(newTransaction.display_source) : null;

      if (newTransaction.type === "transfer") {
        // For transfers, create a single transfer record
        const { error: transferError } = await supabase
          .from("transactions")
          .insert([{
            type: newTransaction.type,
            amount: newTransaction.amount,
            category: newTransaction.category,
            source: sourceBaseId,
            description: newTransaction.description,
            base_source_id: sourceBaseId,
            display_source: destinationBaseId,
            date: new Date().toISOString(),
            user_id: user.id
          }]);

        if (transferError) throw transferError;

        // Update source (debit)
        await updatePaymentSourceAmount(
          sourceBaseId,
          Number(newTransaction.amount),
          'expense',
          false
        );

        // Update destination (credit)
        if (destinationBaseId) {
          await updatePaymentSourceAmount(
            destinationBaseId,
            Number(newTransaction.amount),
            'income',
            false
          );
        }
      } else {
        // For regular income/expense transactions
        const { error: transactionError } = await supabase
          .from("transactions")
          .insert([{
            type: newTransaction.type,
            amount: newTransaction.amount,
            category: newTransaction.category,
            source: sourceBaseId,
            description: newTransaction.description,
            base_source_id: sourceBaseId,
            display_source: newTransaction.display_source,
            date: new Date().toISOString(),
            user_id: user.id
          }]);

        if (transactionError) throw transactionError;

        // Update source amount for income/expense
        await updatePaymentSourceAmount(
          sourceBaseId,
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