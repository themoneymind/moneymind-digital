import { Transaction, TransactionType, NewTransaction } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";
import { updatePaymentSourceAmount, validateExpenseAmount } from "@/utils/paymentSourceUtils";
import { supabase } from "@/integrations/supabase/client";

export const useTransactionOperations = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const handleTransactionEffect = async (
    sourceId: string,
    amount: number,
    type: TransactionType,
    isReverse: boolean = false
  ) => {
    // When reversing, we do the opposite of the transaction type
    // For expense: reverse means add the amount back
    // For income: reverse means subtract the amount
    const shouldAdd = isReverse ? type === "expense" : type === "income";
    await updatePaymentSourceAmount(sourceId, amount, shouldAdd);
  };

  const addTransaction = async (transaction: NewTransaction) => {
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
      .insert([{
        ...transaction,
        date: new Date().toISOString()
      }]);

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
    const { data: originalTransaction } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .single();

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

    // Apply new transaction effect
    await handleTransactionEffect(
      updates.source || originalTransaction.source,
      Number(updates.amount || originalTransaction.amount),
      updates.type as TransactionType || originalTransaction.type as TransactionType
    );

    const { error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    await refreshData();
  };

  return {
    addTransaction,
    editTransaction
  };
};