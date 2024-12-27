import { useState } from "react";
import { Transaction } from "@/types/finance";
import { PaymentSource } from "@/types/finance";

export const useFinanceState = () => {
  const initialDate = new Date();
  initialDate.setHours(0, 0, 0, 0);
  
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);
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
