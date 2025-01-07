import { useState } from "react";
import { TransactionType } from "@/types/finance";

export const useTransactionForm = () => {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [destinationSource, setDestinationSource] = useState("");
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
    setDestinationSource("");
    setDescription("");
    setSelectedDate(new Date());
  };

  return {
    type,
    amount,
    category,
    source,
    destinationSource,
    description,
    selectedDate,
    customCategories,
    setType,
    setAmount,
    setCategory,
    setSource,
    setDestinationSource,
    setDescription,
    setSelectedDate,
    setCustomCategories,
    resetForm,
  };
};