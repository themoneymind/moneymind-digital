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
      newAmount = type === "income" 
        ? Number(source.amount) - Number(amount)
        : Number(source.amount) + Number(amount);
    } else {
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
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          ...transaction,
          user_id: user.id,
          date: new Date().toISOString(),
        });

      if (transactionError) throw transactionError;

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

      const { error: updateError } = await supabase
        .from("transactions")
        .update(formattedUpdates)
        .eq("id", id)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      if (updates.amount !== undefined && updates.amount !== originalTransaction.amount) {
        await updatePaymentSourceAmount(
          originalTransaction.source,
          Number(originalTransaction.amount),
          originalTransaction.type as "income" | "expense",
          true
        );

        await updatePaymentSourceAmount(
          updates.source || originalTransaction.source,
          Number(updates.amount),
          originalTransaction.type as "income" | "expense"
        );
      }

      if (updates.source && updates.source !== originalTransaction.source && updates.amount === undefined) {
        await updatePaymentSourceAmount(
          originalTransaction.source,
          Number(originalTransaction.amount),
          originalTransaction.type as "income" | "expense",
          true
        );

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
      const { data: transaction, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const { error: deleteError } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      await updatePaymentSourceAmount(
        transaction.source,
        Number(transaction.amount),
        transaction.type as "income" | "expense",
        true
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