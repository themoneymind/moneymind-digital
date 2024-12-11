import { useState, useCallback } from "react";
import { Transaction } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";

export const useFinanceState = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentSources, setPaymentSources] = useState<PaymentSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetCurrentMonth = useCallback((date: Date) => {
    console.log("Setting new month:", date);
    setCurrentMonth(new Date(date));
  }, []);

  return {
    currentMonth,
    setCurrentMonth: handleSetCurrentMonth,
    transactions,
    setTransactions,
    paymentSources,
    setPaymentSources,
    isLoading,
    setIsLoading,
  };
};