import { useState } from "react";
import { Transaction } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";

export const useFinanceState = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentSources, setPaymentSources] = useState<PaymentSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return {
    currentMonth,
    setCurrentMonth,
    transactions,
    setTransactions,
    paymentSources,
    setPaymentSources,
    isLoading,
    setIsLoading,
  };
};