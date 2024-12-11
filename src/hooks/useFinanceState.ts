import { useState, useCallback } from "react";
import { Transaction } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";

export const useFinanceState = () => {
  const initialDate = new Date();
  initialDate.setHours(0, 0, 0, 0);
  
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentSources, setPaymentSources] = useState<PaymentSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetCurrentMonth = useCallback((date: Date) => {
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