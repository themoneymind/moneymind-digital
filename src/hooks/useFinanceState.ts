import { useState, useCallback } from "react";
import { Transaction } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";

export const useFinanceState = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentSources, setPaymentSources] = useState<PaymentSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetCurrentMonth = useCallback((date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    console.log("Setting new month:", {
      oldDate: currentMonth.toISOString(),
      newDate: newDate.toISOString()
    });
    setCurrentMonth(newDate);
  }, [currentMonth]);

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