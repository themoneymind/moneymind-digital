import { Transaction, TransactionType } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";
import { updatePaymentSourceAmount, validateExpenseAmount } from "@/utils/paymentSourceUtils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const useTransactionOperations = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();

  const validateUUID = (id: string): boolean => {
    return UUID_REGEX.test(id);
  };

  const handleTransactionEffect = async (
    sourceId: string,
    amount: number,
    type: TransactionType,
    isReverse: boolean = false
  ) => {
    if (!validateUUID(sourceId)) {
      throw new Error("Invalid payment source ID format");
    }

    const shouldAdd = isReverse ? type === "expense" : type === "income";
    await updatePaymentSourceAmount(sourceId, amount, shouldAdd);
  };

  const addTransaction = async (transaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) throw new Error("User not authenticated");

    if (!validateUUID(transaction.source)) {
      throw new Error("Invalid payment source ID format");
    }

    if (transaction.type === "expense") {
      const hasEnoughBalance = validateExpenseAmount(
        paymentSources,
        transaction.source,
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
      transaction.source,
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

    if (!validateUUID(id)) {
      throw new Error("Invalid transaction ID format");
    }

    if (updates.source && !validateUUID(updates.source)) {
      throw new Error("Invalid payment source ID format");
    }

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

    // If it's an expense, validate new amount
    if (originalTransaction.type === "expense" && updates.amount) {
      const hasEnoughBalance = validateExpenseAmount(
        paymentSources,
        updates.source || originalTransaction.source,
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

    // Format date to ISO string if it exists in updates
    const formattedUpdates = {
      ...updates,
      date: updates.date ? updates.date.toISOString() : undefined
    };

    // Apply new transaction effect
    await handleTransactionEffect(
      updates.source || originalTransaction.source,
      Number(updates.amount || originalTransaction.amount),
      updates.type as TransactionType || originalTransaction.type as TransactionType
    );

    const { error } = await supabase
      .from("transactions")
      .update(formattedUpdates)
      .eq("id", id);

    if (error) throw error;
    await refreshData();
  };

  return {
    addTransaction,
    editTransaction
  };
};