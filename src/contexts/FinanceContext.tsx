import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Transaction, TransactionType } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";
import { useTransactions } from "@/hooks/useTransactions";
import { usePaymentSources } from "@/hooks/usePaymentSources";
import { useTransactionOperations } from "@/hooks/useTransactionOperations";
import { supabase } from "@/integrations/supabase/client";

type FinanceContextType = {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  balance: number;
  income: number;
  expense: number;
  transactions: Transaction[];
  paymentSources: PaymentSource[];
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(false);
  
  const { fetchTransactions } = useTransactions();
  const { 
    fetchPaymentSources, 
    addPaymentSource: addSource, 
    editPaymentSource: editSource, 
    deletePaymentSource: deleteSource 
  } = usePaymentSources();

  const refreshData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const [txns, sources] = await Promise.all([
        fetchTransactions(),
        fetchPaymentSources()
      ]);
      setTransactions(txns);
      setPaymentSources(sources);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { addTransaction, editTransaction } = useTransactionOperations(
    paymentSources,
    refreshData
  );

  useEffect(() => {
    if (!user) return;
    refreshData();

    // Subscribe to real-time changes
    const transactionsSubscription = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        () => {
          refreshData();
        }
      )
      .subscribe();

    const sourcesSubscription = supabase
      .channel('sources_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_sources'
        },
        () => {
          refreshData();
        }
      )
      .subscribe();

    return () => {
      transactionsSubscription.unsubscribe();
      sourcesSubscription.unsubscribe();
    };
  }, [user]);

  const loadPaymentSources = async () => {
    if (!user) return;
    const sources = await fetchPaymentSources();
    setPaymentSources(sources);
  };

  const loadTransactions = async () => {
    if (!user) return;
    const txns = await fetchTransactions();
    setTransactions(txns);
  };

  const addPaymentSource = async (source: Omit<PaymentSource, "id">) => {
    await addSource(source);
    await refreshData();
  };

  const editPaymentSource = async (source: PaymentSource) => {
    await editSource(source);
    await refreshData();
  };

  const deletePaymentSource = async (id: string) => {
    await deleteSource(id);
    await refreshData();
  };

  // Calculate totals based on transactions
  const balance = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
  }, 0);

  const income = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc;
  }, 0);

  const expense = transactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + Number(curr.amount) : acc;
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
        isLoading,
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