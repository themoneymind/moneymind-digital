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
    isReversal: boolean = false
  ) => {
    console.log("Updating payment source:", { sourceId, amount, type, isReversal });
    const source = paymentSources.find(s => s.id === sourceId);
    if (!source) return;

    let newAmount;
    if (isReversal) {
      // When reversing, we do the opposite of the original transaction
      newAmount = type === "income" 
        ? Number(source.amount) - Number(amount)
        : Number(source.amount) + Number(amount);
    } else {
      // When adding new transaction, add for income and subtract for expense
      newAmount = type === "income" 
        ? Number(source.amount) + Number(amount)
        : Number(source.amount) - Number(amount);
    }

    console.log("New amount calculation:", {
      currentAmount: source.amount,
      operation: isReversal ? "reverse" : "apply",
      change: amount,
      result: newAmount
    });

    const { error } = await supabase
      .from("payment_sources")
      .update({ amount: newAmount })
      .eq("id", sourceId);

    if (error) throw error;
  };

  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">
  ) => {
    if (!user) return;

    try {
      // Update the payment source first
      await updatePaymentSourceAmount(
        transaction.source,
        Number(transaction.amount),
        transaction.type as "income" | "expense"
      );

      // Create the transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          ...transaction,
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
      // Fetch the original transaction
      const { data: originalTransaction, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Reverse the original transaction's effect on the payment source
      await updatePaymentSourceAmount(
        originalTransaction.source,
        Number(originalTransaction.amount),
        originalTransaction.type,
        true // isReversal = true
      );

      // Apply the new transaction amount
      if (updates.amount !== undefined) {
        const targetSource = updates.source || originalTransaction.source;
        await updatePaymentSourceAmount(
          targetSource,
          Number(updates.amount),
          originalTransaction.type,
          false // Not a reversal, applying new amount
        );
      }

      // Update the transaction record
      const { error: updateError } = await supabase
        .from("transactions")
        .update(updates)
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
      // Fetch the transaction to be deleted
      const { data: transaction, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Reverse the transaction's effect on the payment source
      await updatePaymentSourceAmount(
        transaction.source,
        Number(transaction.amount),
        transaction.type,
        true // isReversal = true
      );

      // Delete the transaction record
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