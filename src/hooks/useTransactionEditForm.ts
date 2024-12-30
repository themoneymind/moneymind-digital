import { useState, useCallback } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Transaction } from "@/types/transactions";
import { useToast } from "@/hooks/use-toast";

export const useTransactionEditForm = (
  transaction: Transaction,
  onSuccess: () => void
) => {
  const { editTransaction } = useFinance();
  const { toast } = useToast();
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

  const handleSubmit = async (e: React.FormEvent, updatedTransaction?: Partial<Transaction>) => {
    e.preventDefault();
    
    // Validate source selection
    if (!selectedSource) {
      toast({
        title: "Error",
        description: "Please select a payment source",
        variant: "destructive",
      });
      throw new Error("Please select a payment source");
    }

    const numAmount = Number(amount);
    if (amount && isNaN(numAmount)) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
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