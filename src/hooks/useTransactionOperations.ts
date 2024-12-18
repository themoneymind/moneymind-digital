import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";
import { toast } from "sonner";

export const useTransactionOperations = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();

  const updatePaymentSourceAmount = async (
    sourceId: string,
    amount: number,
    type: "income" | "expense",
    isDelete: boolean = false
  ) => {
    const source = paymentSources.find(s => s.id === sourceId);
    if (!source) return;

    let newAmount;
    if (isDelete) {
      // If deleting, reverse the transaction effect
      newAmount = type === "income" 
        ? Number(source.amount) - Number(amount)
        : Number(source.amount) + Number(amount);
    } else {
      // For add/edit
      newAmount = type === "income" 
        ? Number(source.amount) + Number(amount)
        : Number(source.amount) - Number(amount);
    }

    const { error } = await supabase
      .from("payment_sources")
      .update({ amount: newAmount })
      .eq("id", sourceId)
      .eq("user_id", user?.id);

    if (error) throw error;
  };

  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">
  ) => {
    if (!user) return;

    try {
      // First add the transaction
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          ...transaction,
          user_id: user.id,
          date: new Date().toISOString(),
        });

      if (transactionError) throw transactionError;

      // Then update the payment source amount
      await updatePaymentSourceAmount(
        transaction.source,
        Number(transaction.amount),
        transaction.type as "income" | "expense"
      );

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
      // Get the original transaction first
      const { data: originalTransaction, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Update the transaction
      const { error: updateError } = await supabase
        .from("transactions")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      // If amount changed, update payment source
      if (updates.amount !== undefined && updates.amount !== originalTransaction.amount) {
        // First, reverse the original transaction's effect
        await updatePaymentSourceAmount(
          originalTransaction.source,
          Number(originalTransaction.amount),
          originalTransaction.type as "income" | "expense",
          true // isDelete = true to reverse the effect
        );

        // Then apply the new transaction's effect
        await updatePaymentSourceAmount(
          updates.source || originalTransaction.source,
          Number(updates.amount),
          originalTransaction.type as "income" | "expense"
        );
      }

      // If source changed but amount didn't, move the amount between sources
      if (updates.source && updates.source !== originalTransaction.source && updates.amount === undefined) {
        // Remove amount from old source
        await updatePaymentSourceAmount(
          originalTransaction.source,
          Number(originalTransaction.amount),
          originalTransaction.type as "income" | "expense",
          true
        );

        // Add amount to new source
        await updatePaymentSourceAmount(
          updates.source,
          Number(originalTransaction.amount),
          originalTransaction.type as "income" | "expense"
        );
      }

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
      // Get the transaction first
      const { data: transaction, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Delete the transaction
      const { error: deleteError } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      // Update payment source amount (reverse the transaction effect)
      await updatePaymentSourceAmount(
        transaction.source,
        Number(transaction.amount),
        transaction.type as "income" | "expense",
        true // isDelete = true to reverse the effect
      );

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