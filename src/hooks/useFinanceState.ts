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
    // Ensure we're working with a new Date object and set time to start of day
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    setCurrentMonth(newDate);
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