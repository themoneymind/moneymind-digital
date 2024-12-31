import { useState } from "react";
import { TransactionType } from "@/types/finance";

export const useTransactionFormState = () => {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customCategories, setCustomCategories] = useState<{
    expense: string[];
    income: string[];
    transfer: string[];
  }>({
    expense: [],
    income: [],
    transfer: [],
  });

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setSource("");
    setDescription("");
    setSelectedDate(new Date());
  };

  return {
    type,
    setType,
    amount,
    setAmount,
    category,
    setCategory,
    source,
    setSource,
    description,
    setDescription,
    selectedDate,
    setSelectedDate,
    customCategories,
    setCustomCategories,
    resetForm,
  };
};