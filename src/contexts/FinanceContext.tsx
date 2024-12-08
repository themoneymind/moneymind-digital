import React, { createContext, useContext, useState, useCallback } from "react";
import { startOfMonth, endOfMonth } from "date-fns";

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
  linked?: boolean;
  upiApps?: string[];
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
  editTransaction: (id: string, updates: Partial<Omit<Transaction, "id">>) => void;
  addPaymentSource: (source: Omit<PaymentSource, "id">) => void;
  editPaymentSource: (source: PaymentSource) => void;
  deletePaymentSource: (id: string) => void;
  getFormattedPaymentSources: () => { id: string; name: string }[];
  getTransactionsBySource: (sourceId: string) => Transaction[];
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
    { id: "1", name: "Canara bank", type: "Bank", amount: 120000, linked: true, upiApps: ["GPay", "PhonePe", "Cred"] },
    { id: "2", name: "Pluxee", type: "Credit Card", amount: 0 },
    { id: "3", name: "UPI", type: "UPI", amount: 0 },
    { id: "4", name: "HDFC bank", type: "Bank", amount: 93050, linked: true, upiApps: ["PhonePe", "GPay"] },
    { id: "5", name: "ICICI", type: "Bank", amount: 13250, linked: true, upiApps: ["GPay"] },
  ]);

  const getFormattedPaymentSources = useCallback(() => {
    const formattedSources: { id: string; name: string }[] = [];
    
    paymentSources.forEach(source => {
      formattedSources.push({
        id: source.id,
        name: source.name
      });

      if (source.linked && source.upiApps && source.upiApps.length > 0) {
        source.upiApps.forEach(upiApp => {
          formattedSources.push({
            id: `${source.id}-${upiApp.toLowerCase()}`,
            name: `${source.name} ${upiApp}`
          });
        });
      }
    });

    return formattedSources;
  }, [paymentSources]);

  const getTransactionsBySource = useCallback((sourceId: string) => {
    return transactions.filter(transaction => transaction.source === sourceId);
  }, [transactions]);

  const balance = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const income = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + curr.amount : acc;
  }, 0);

  const expense = transactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + curr.amount : acc;
  }, 0);

  const addTransaction = useCallback((newTransaction: Omit<Transaction, "id" | "date">) => {
    const transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
    };
    setTransactions((prev) => [transaction, ...prev]);

    // Update payment source amount
    const sourceId = transaction.source.split('-')[0]; // Handle UPI app IDs
    setPaymentSources(prev => prev.map(source => {
      if (source.id === sourceId) {
        return {
          ...source,
          amount: transaction.type === 'expense' 
            ? source.amount - transaction.amount
            : source.amount + transaction.amount
        };
      }
      return source;
    }));
  }, []);

  const editTransaction = useCallback((id: string, updates: Partial<Omit<Transaction, "id">>) => {
    setTransactions(prev => {
      const oldTransaction = prev.find(t => t.id === id);
      if (!oldTransaction) return prev;

      const updatedTransactions = prev.map(t => {
        if (t.id === id) {
          return { ...t, ...updates };
        }
        return t;
      });

      // Update payment source amounts if amount changed
      if (updates.amount !== undefined && updates.amount !== oldTransaction.amount) {
        const sourceId = oldTransaction.source.split('-')[0];
        const amountDiff = updates.amount - oldTransaction.amount;
        
        setPaymentSources(prevSources => prevSources.map(source => {
          if (source.id === sourceId) {
            return {
              ...source,
              amount: oldTransaction.type === 'expense'
                ? source.amount + (oldTransaction.amount - updates.amount)
                : source.amount + (updates.amount - oldTransaction.amount)
            };
          }
          return source;
        }));
      }

      return updatedTransactions;
    });
  }, []);

  const addPaymentSource = useCallback((newSource: Omit<PaymentSource, "id">) => {
    const source = {
      ...newSource,
      id: Math.random().toString(36).substr(2, 9),
    };
    setPaymentSources((prev) => [...prev, source]);
  }, []);

  const editPaymentSource = useCallback((updatedSource: PaymentSource) => {
    setPaymentSources((prev) =>
      prev.map((source) =>
        source.id === updatedSource.id ? updatedSource : source
      )
    );
  }, []);

  const deletePaymentSource = useCallback((id: string) => {
    setPaymentSources((prev) => prev.filter((source) => source.id !== id));
  }, []);

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
        editTransaction,
        addPaymentSource,
        editPaymentSource,
        deletePaymentSource,
        getFormattedPaymentSources,
        getTransactionsBySource,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};