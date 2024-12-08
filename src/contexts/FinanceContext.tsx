import React, { createContext, useContext, useState, useCallback } from "react";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  source: string;
  description?: string;
  date: Date;
};

type PaymentSource = {
  id: string;
  name: string;
  type: string;
  amount: number;
  linked?: number;
};

type FinanceContextType = {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  balance: number;
  income: number;
  expense: number;
  transactions: Transaction[];
  paymentSources: PaymentSource[];
  addTransaction: (transaction: Omit<Transaction, "id" | "date">) => void;
  addPaymentSource: (source: Omit<PaymentSource, "id">) => void;
};

const FinanceContext = createContext<FinanceContextType | null>(null);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "expense",
      amount: 10075,
      category: "Food",
      source: "Bank Account",
      date: new Date("2024-12-02T20:46:00"),
    },
    {
      id: "2",
      type: "income",
      amount: 125000,
      category: "Salary",
      source: "Bank Account",
      date: new Date("2024-12-02T20:45:00"),
    },
  ]);

  const [paymentSources, setPaymentSources] = useState<PaymentSource[]>([
    { id: "1", name: "Canara bank", type: "Bank", amount: 120000, linked: 1 },
    { id: "2", name: "Pluxee", type: "Credit Card", amount: 0 },
    { id: "3", name: "UPI", type: "UPI", amount: 0 },
    { id: "4", name: "HDFC bank", type: "Bank", amount: 93050, linked: 2 },
    { id: "5", name: "ICICI", type: "Bank", amount: 13250, linked: 1 },
  ]);

  const addTransaction = useCallback((newTransaction: Omit<Transaction, "id" | "date">) => {
    const transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
    };
    setTransactions((prev) => [transaction, ...prev]);
  }, []);

  const addPaymentSource = useCallback((newSource: Omit<PaymentSource, "id">) => {
    const source = {
      ...newSource,
      id: Math.random().toString(36).substr(2, 9),
    };
    setPaymentSources((prev) => [...prev, source]);
  }, []);

  const balance = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const income = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + curr.amount : acc;
  }, 0);

  const expense = transactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + curr.amount : acc;
  }, 0);

  return (
    <FinanceContext.Provider
      value={{
        currentMonth,
        setCurrentMonth,
        balance,
        income,
        expense,
        transactions,
        paymentSources,
        addTransaction,
        addPaymentSource,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};