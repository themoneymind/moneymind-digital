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
    console.log("Updating payment source:", { sourceId, amount, type, isDelete });
    const source = paymentSources.find(s => s.id === sourceId);
    if (!source) return;

    let newAmount;
    if (isDelete) {
      // When deleting or reversing, we subtract for income and add for expense
      newAmount = type === "income" 
        ? Number(source.amount) - Number(amount)
        : Number(source.amount) + Number(amount);
    } else {
      // When adding or updating, we add for income and subtract for expense
      newAmount = type === "income" 
        ? Number(source.amount) + Number(amount)
        : Number(source.amount) - Number(amount);
    }

    console.log("New amount calculation:", {
      currentAmount: source.amount,
      operation: isDelete ? "reverse" : "apply",
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
      // First, update the payment source
      await updatePaymentSourceAmount(
        transaction.source,
        Number(transaction.amount),
        transaction.type as "income" | "expense"
      );

      // Then, create the transaction record
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
      // Fetch the original transaction first
      const { data: originalTransaction, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Convert Date object to ISO string if it exists
      const formattedUpdates = {
        ...updates,
        date: updates.date ? new Date(updates.date).toISOString() : undefined
      };

      console.log("Transaction edit operation:", {
        original: originalTransaction,
        updates: formattedUpdates
      });

      // First, reverse the effect of the original transaction
      await updatePaymentSourceAmount(
        originalTransaction.source,
        Number(originalTransaction.amount),
        originalTransaction.type as "income" | "expense",
        true // isDelete = true to reverse the effect
      );

      // Then, apply the new transaction amount
      if (updates.amount !== undefined) {
        await updatePaymentSourceAmount(
          updates.source || originalTransaction.source,
          Number(updates.amount),
          (updates.type || originalTransaction.type) as "income" | "expense"
        );
      }

      // Update the transaction record
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

      // First reverse the transaction's effect on the payment source
      await updatePaymentSourceAmount(
        transaction.source,
        Number(transaction.amount),
        transaction.type as "income" | "expense",
        true // isDelete = true to reverse the effect
      );

      // Then delete the transaction
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