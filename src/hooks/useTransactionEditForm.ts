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
  const [selectedSource, setSelectedSource] = useState(transaction.base_source_id);
  const [description, setDescription] = useState(transaction.description || "");

  console.log("Transaction Edit Form Init:", {
    transaction,
    selectedSource,
    base_source_id: transaction.base_source_id
  });

  const resetForm = useCallback(() => {
    setAmount("");
    setOperation("add");
    setSelectedSource(transaction.base_source_id);
    setDescription(transaction.description || "");
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent, updatedTransaction?: Partial<Transaction>) => {
    e.preventDefault();
    
    console.log("Submitting transaction edit:", {
      selectedSource,
      updatedTransaction,
      base_source_id: transaction.base_source_id
    });

    // Validate source selection
    if (!selectedSource) {
      console.error("Source validation failed:", { selectedSource });
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

    try {
      await editTransaction(transaction.id, {
        amount: finalAmount,
        source: selectedSource,
        description,
        ...updatedTransaction
      });

      onSuccess();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
      throw error;
    }
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