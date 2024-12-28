import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionType } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";
import { toast } from "sonner";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

export const useTransactionOperations = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();

  const updatePaymentSourceAmount = async (
    sourceId: string,
    amount: number,
    type: TransactionType,
    isReversal: boolean = false
  ) => {
    const baseSourceId = getBaseSourceId(sourceId);
    console.log("Updating payment source:", { sourceId, baseSourceId, amount, type, isReversal });
    
    const source = paymentSources.find(s => s.id === baseSourceId);
    if (!source) return;

    let newAmount;
    if (isReversal) {
      newAmount = type === "income" 
        ? Number(source.amount) - Number(amount)
        : Number(source.amount) + Number(amount);
    } else {
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
      .eq("id", baseSourceId);

    if (error) throw error;
  };

  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">
  ) => {
    if (!user) return;

    try {
      const baseSourceId = getBaseSourceId(transaction.source);
      
      await updatePaymentSourceAmount(
        baseSourceId,
        Number(transaction.amount),
        transaction.type
      );

      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          ...transaction,
          source: baseSourceId,
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

      await updatePaymentSourceAmount(
        originalTransaction.source,
        Number(originalTransaction.amount),
        originalTransaction.type as TransactionType,
        true
      );

      if (updates.amount !== undefined) {
        const targetSource = updates.source ? getBaseSourceId(updates.source) : originalTransaction.source;
        await updatePaymentSourceAmount(
          targetSource,
          Number(updates.amount),
          (updates.type || originalTransaction.type) as TransactionType,
          false
        );
      }

      // Convert Date to ISO string if it exists in updates
      const formattedUpdates = {
        ...updates,
        source: updates.source ? getBaseSourceId(updates.source) : updates.source,
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

      await updatePaymentSourceAmount(
        transaction.source,
        Number(transaction.amount),
        transaction.type as TransactionType,
        true
      );

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