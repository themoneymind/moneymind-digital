import { useState, useCallback } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types/transactions";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setAmount("");
    setOperation("add");
    setSelectedSource(transaction.source);
    setDescription(transaction.description || "");
    setIsSubmitting(false);
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSource) {
      toast({
        title: "Error",
        description: "Please select a payment source",
        variant: "destructive",
      });
      return;
    }

    const numAmount = Number(amount);
    if (amount && isNaN(numAmount)) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const finalAmount = amount 
        ? (operation === "add" 
            ? transaction.amount + numAmount 
            : transaction.amount - numAmount)
        : transaction.amount;

      await editTransaction(transaction.id, {
        amount: finalAmount,
        source: selectedSource,
        description,
      });

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });

      onSuccess();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update transaction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
    isSubmitting,
    handleSubmit,
    resetForm,
  };
};