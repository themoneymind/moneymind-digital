import { Transaction, TransactionType } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";
import { 
  updatePaymentSourceAmount, 
  validateExpenseAmount, 
  getBaseSourceId,
} from "@/utils/paymentSourceUtils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useTransactionOperations = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();

  const handleTransactionEffect = async (
    sourceId: string,
    amount: number,
    type: TransactionType,
    isReverse: boolean = false
  ) => {
    const baseSourceId = getBaseSourceId(sourceId);
    const shouldAdd = isReverse ? type === "expense" : type === "income";
    await updatePaymentSourceAmount(baseSourceId, amount, shouldAdd);
  };

  const addTransaction = async (transaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) throw new Error("User not authenticated");

    const baseSourceId = getBaseSourceId(transaction.source);
    
    if (transaction.type === "expense") {
      const hasEnoughBalance = validateExpenseAmount(
        paymentSources,
        baseSourceId,
        Number(transaction.amount)
      );
      if (!hasEnoughBalance) {
        throw new Error("Insufficient balance in the payment source");
      }
    }

    const { error } = await supabase
      .from("transactions")
      .insert({
        ...transaction,
        user_id: user.id,
        date: new Date().toISOString()
      });

    if (error) throw error;

    await handleTransactionEffect(
      baseSourceId,
      Number(transaction.amount),
      transaction.type
    );
    await refreshData();
  };

  const editTransaction = async (
    id: string,
    updates: Partial<Omit<Transaction, "id" | "created_at" | "updated_at">>
  ) => {
    if (!user) throw new Error("User not authenticated");

    const { data: originalTransaction, error: fetchError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (!originalTransaction) throw new Error("Transaction not found");

    // Revert original transaction effect
    await handleTransactionEffect(
      originalTransaction.source,
      originalTransaction.amount,
      originalTransaction.type as TransactionType,
      true
    );

    const sourceId = updates.source || originalTransaction.source;
    const newAmount = updates.amount || originalTransaction.amount;
    const type = originalTransaction.type as TransactionType;

    // If it's an expense, validate the new amount
    if (type === "expense") {
      const baseSourceId = getBaseSourceId(sourceId);
      const source = paymentSources.find(s => s.id === baseSourceId);
      
      if (!source) {
        // Reapply original effect since we're failing
        await handleTransactionEffect(
          originalTransaction.source,
          originalTransaction.amount,
          type
        );
        throw new Error("Payment source not found");
      }

      // Add back the original amount since we reverted it
      const adjustedSourceAmount = source.amount + originalTransaction.amount;
      
      if (adjustedSourceAmount < newAmount) {
        // Reapply original effect since we're failing
        await handleTransactionEffect(
          originalTransaction.source,
          originalTransaction.amount,
          type
        );
        throw new Error("Insufficient balance in the payment source");
      }
    }

    // Apply new transaction effect
    await handleTransactionEffect(
      sourceId,
      newAmount,
      type
    );

    const { error } = await supabase
      .from("transactions")
      .update({
        ...updates,
        date: updates.date ? updates.date.toISOString() : undefined
      })
      .eq("id", id);

    if (error) {
      // If update fails, revert to original state
      await handleTransactionEffect(
        originalTransaction.source,
        originalTransaction.amount,
        type
      );
      throw error;
    }

    await refreshData();
  };

  return {
    addTransaction,
    editTransaction
  };
};