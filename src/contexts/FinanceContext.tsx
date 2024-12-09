import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Transaction, PaymentSource } from "@/types/finance";
import { useTransactions } from "@/hooks/useTransactions";
import { usePaymentSources } from "@/hooks/usePaymentSources";

type FinanceContextType = {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  balance: number;
  income: number;
  expense: number;
  transactions: Transaction[];
  paymentSources: PaymentSource[];
  addTransaction: (transaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">) => Promise<void>;
  editTransaction: (id: string, updates: Partial<Omit<Transaction, "id" | "created_at" | "updated_at">>) => Promise<void>;
  addPaymentSource: (source: Omit<PaymentSource, "id">) => Promise<void>;
  editPaymentSource: (source: PaymentSource) => Promise<void>;
  deletePaymentSource: (id: string) => Promise<void>;
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
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentSources, setPaymentSources] = useState<PaymentSource[]>([]);
  
  const { fetchTransactions, addTransaction: addTxn, editTransaction: editTxn } = useTransactions();
  const { 
    fetchPaymentSources, 
    addPaymentSource: addSource, 
    editPaymentSource: editSource, 
    deletePaymentSource: deleteSource 
  } = usePaymentSources();

  // Fetch payment sources
  useEffect(() => {
    if (!user) return;
    loadPaymentSources();
  }, [user, fetchPaymentSources]);

  // Fetch transactions
  useEffect(() => {
    if (!user) return;
    loadTransactions();
  }, [user, fetchTransactions]);

  const loadPaymentSources = async () => {
    const sources = await fetchPaymentSources();
    setPaymentSources(sources);
  };

  const loadTransactions = async () => {
    const txns = await fetchTransactions();
    setTransactions(txns);
  };

  const addTransaction = async (transaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">) => {
    await addTxn(transaction);
    
    // Update payment source amount
    const sourceIndex = paymentSources.findIndex(s => s.id === transaction.source);
    if (sourceIndex !== -1) {
      const updatedSource = { ...paymentSources[sourceIndex] };
      updatedSource.amount = transaction.type === 'expense' 
        ? Number(updatedSource.amount) - Number(transaction.amount)
        : Number(updatedSource.amount) + Number(transaction.amount);
      
      await editSource(updatedSource);
    }
    
    // Refresh data
    await Promise.all([loadTransactions(), loadPaymentSources()]);
  };

  const editTransaction = async (id: string, updates: Partial<Omit<Transaction, "id" | "created_at" | "updated_at">>) => {
    await editTxn(id, updates);
    await Promise.all([loadTransactions(), loadPaymentSources()]);
  };

  const editPaymentSource = async (source: PaymentSource) => {
    await editSource(source);
    await loadPaymentSources();
  };

  const addPaymentSource = async (source: Omit<PaymentSource, "id">) => {
    await addSource(source);
    await loadPaymentSources();
  };

  const deletePaymentSource = async (id: string) => {
    await deleteSource(id);
    await loadPaymentSources();
  };

  const balance = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const income = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + curr.amount : acc;
  }, 0);

  const expense = transactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + curr.amount : acc;
  }, 0);

  const getFormattedPaymentSources = () => {
    const formattedSources: { id: string; name: string }[] = [];
    
    paymentSources.forEach(source => {
      formattedSources.push({
        id: source.id,
        name: source.name
      });

      if (source.linked && source.upi_apps && source.upi_apps.length > 0) {
        source.upi_apps.forEach(upiApp => {
          formattedSources.push({
            id: `${source.id}-${upiApp.toLowerCase()}`,
            name: `${source.name} ${upiApp}`
          });
        });
      }
    });

    return formattedSources;
  };

  const getTransactionsBySource = (sourceId: string) => {
    return transactions.filter(transaction => transaction.source === sourceId);
  };

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