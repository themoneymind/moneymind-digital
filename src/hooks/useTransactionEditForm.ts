import { useState, useCallback } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Transaction } from "@/types/transactions";
import { useToast } from "@/hooks/use-toast";
import { RepeatOption } from "@/types/transactions";

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(transaction.date));
  const [repeatFrequency, setRepeatFrequency] = useState<RepeatOption>(
    transaction.repeat_frequency as RepeatOption || "never"
  );

  const resetForm = useCallback(() => {
    setAmount("");
    setOperation("add");
    setSelectedSource(transaction.source);
    setDescription(transaction.description || "");
    setSelectedDate(new Date(transaction.date));
    setRepeatFrequency(transaction.repeat_frequency as RepeatOption || "never");
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent, updatedTransaction?: Partial<Transaction>) => {
    e.preventDefault();
    
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

    const finalAmount = amount ? (
      operation === "add" 
        ? Number(transaction.amount) + numAmount 
        : Number(transaction.amount) - numAmount
    ) : Number(transaction.amount);

    try {
      // Ensure selectedDate is a valid Date object before converting to ISO string
      const dateToSubmit = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
      
      await editTransaction(transaction.id, {
        amount: finalAmount,
        source: selectedSource,
        description,
        date: dateToSubmit.toISOString(),
        repeat_frequency: repeatFrequency,
        display_source: transaction.display_source,
        ...updatedTransaction
      });

      onSuccess();
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
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
    selectedDate,
    setSelectedDate,
    repeatFrequency,
    setRepeatFrequency,
    handleSubmit,
    resetForm,
  };
};