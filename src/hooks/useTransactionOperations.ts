import { Transaction, TransactionType } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";
import { 
  updatePaymentSourceAmount, 
  validateExpenseAmount, 
  getBaseSourceId,
  isUpiSource,
  getUpiApp
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

    // If amount is being updated, validate for expense
    if (updates.amount && originalTransaction.type === "expense") {
      const sourceId = updates.source || originalTransaction.source;
      const hasEnoughBalance = validateExpenseAmount(
        paymentSources,
        sourceId,
        Number(updates.amount)
      );
      if (!hasEnoughBalance) {
        // Reapply original effect since we're failing
        await handleTransactionEffect(
          originalTransaction.source,
          originalTransaction.amount,
          originalTransaction.type as TransactionType
        );
        throw new Error("Insufficient balance in the payment source");
      }
    }

    // Apply new transaction effect
    const newAmount = updates.amount || originalTransaction.amount;
    const newSource = updates.source || originalTransaction.source;
    await handleTransactionEffect(
      newSource,
      newAmount,
      originalTransaction.type as TransactionType
    );

    const { error } = await supabase
      .from("transactions")
      .update({
        ...updates,
        date: updates.date ? updates.date.toISOString() : undefined
      })
      .eq("id", id);

    if (error) throw error;
    await refreshData();
  };

  return {
    addTransaction,
    editTransaction
  };
};