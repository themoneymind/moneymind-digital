import { useState, useCallback } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Transaction } from "@/types/transactions";

export const useTransactionEditForm = (
  transaction: Transaction,
  onSuccess: () => void
) => {
  const { editTransaction } = useFinance();
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [amount, setAmount] = useState("");
  const [selectedSource, setSelectedSource] = useState(transaction.display_source || transaction.source);
  const [description, setDescription] = useState(transaction.description || "");

  const resetForm = useCallback(() => {
    setAmount("");
    setOperation("add");
    setSelectedSource(transaction.display_source || transaction.source);
    setDescription(transaction.description || "");
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent, updatedTransaction?: Partial<Transaction>) => {
    e.preventDefault();
    
    if (!selectedSource) {
      throw new Error("Please select a payment source");
    }

    const numAmount = Number(amount);
    if (amount && isNaN(numAmount)) {
      throw new Error("Please enter a valid amount");
    }

    // Calculate the new final amount based on the operation
    const finalAmount = amount ? (
      operation === "add" 
        ? Number(transaction.amount) + numAmount 
        : Number(transaction.amount) - numAmount
    ) : Number(transaction.amount);

    console.log("Transaction edit calculation:", {
      originalAmount: transaction.amount,
      operation,
      changeAmount: numAmount,
      finalAmount,
      selectedSource,
      updatedTransaction
    });

    await editTransaction(transaction.id, {
      amount: finalAmount,
      source: selectedSource,
      display_source: selectedSource, // Preserve the display source
      description,
      ...updatedTransaction
    });

    onSuccess();
  };

  return {
    operation,
    setOperation,
    amount,
    setAmount,
    selectedSource,
    setSelectedSource,
    description,
    setDescription,
    handleSubmit,
    resetForm,
  };
};