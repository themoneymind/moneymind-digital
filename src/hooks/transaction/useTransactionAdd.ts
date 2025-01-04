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
      console.log("Starting transaction add:", { 
        type: newTransaction.type,
        source: newTransaction.source,
        displaySource: newTransaction.display_source,
        amount: newTransaction.amount 
      });

      // Get base source IDs for both source and destination
      const sourceBaseId = getBaseSourceId(newTransaction.source);
      const destinationBaseId = newTransaction.display_source ? getBaseSourceId(newTransaction.display_source) : null;

      console.log("Base source IDs:", { sourceBaseId, destinationBaseId });

      if (newTransaction.type === "transfer") {
        console.log("Processing transfer transaction");
        
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

        if (transferError) {
          console.error("Transfer insert error:", transferError);
          throw transferError;
        }

        console.log("Transfer record created, updating source amount");

        // Update source (debit)
        await updatePaymentSourceAmount(
          sourceBaseId,
          Number(newTransaction.amount),
          'expense',
          false
        );

        console.log("Source amount updated, updating destination amount");

        // Update destination (credit)
        if (destinationBaseId) {
          await updatePaymentSourceAmount(
            destinationBaseId,
            Number(newTransaction.amount),
            'income',
            false
          );
        }

        console.log("Transfer completed successfully");
      } else {
        console.log("Processing regular transaction");
        
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

        if (transactionError) {
          console.error("Transaction insert error:", transactionError);
          throw transactionError;
        }

        console.log("Regular transaction record created, updating source amount");

        // Update source amount for income/expense
        await updatePaymentSourceAmount(
          sourceBaseId,
          Number(newTransaction.amount),
          newTransaction.type,
          false
        );

        console.log("Regular transaction completed successfully");
      }

      await refreshData();
      toast.success("Transaction added successfully");
    } catch (error) {
      console.error("Error in addTransaction:", error);
      toast.error("Failed to add transaction");
      throw error;
    }
  };

  return { addTransaction };
};