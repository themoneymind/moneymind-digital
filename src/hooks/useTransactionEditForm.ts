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
  const [selectedSource, setSelectedSource] = useState(transaction.source);
  const [description, setDescription] = useState(transaction.description || "");

  const resetForm = useCallback(() => {
    setAmount("");
    setOperation("add");
    setSelectedSource(transaction.source);
    setDescription(transaction.description || "");
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSource) {
      throw new Error("Please select a payment source");
    }

    const numAmount = Number(amount);
    if (amount && isNaN(numAmount)) {
      throw new Error("Please enter a valid amount");
    }

    // Calculate the final amount based on the operation
    let finalAmount = transaction.amount; // Start with original amount
    if (amount) {
      finalAmount = operation === "add" 
        ? transaction.amount + numAmount 
        : transaction.amount - numAmount;
    }

    console.log("Transaction edit operation:", {
      originalAmount: transaction.amount,
      operation,
      changeAmount: numAmount,
      finalAmount
    });

    await editTransaction(transaction.id, {
      amount: finalAmount,
      source: selectedSource,
      description,
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