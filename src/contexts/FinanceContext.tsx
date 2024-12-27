import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Transaction } from "@/types/finance";
import { PaymentSource } from "@/types/finance";
import { useFinanceState } from "@/hooks/useFinanceState";
import { useFinanceCalculations } from "@/hooks/useFinanceCalculations";
import { useFinanceDataSync } from "@/hooks/useFinanceDataSync";
import { useFinanceUtils } from "@/hooks/useFinanceUtils";
import { useTransactionOperations } from "@/hooks/useTransactionOperations";
import { usePaymentSources } from "@/hooks/usePaymentSources";

type FinanceContextType = {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  balance: number;
  income: number;
  expense: number;
  transactions: Transaction[];
  paymentSources: PaymentSource[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">) => Promise<void>;
  editTransaction: (id: string, updates: Partial<Omit<Transaction, "id" | "created_at" | "updated_at">>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
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
  const {
    currentMonth,
    setCurrentMonth,
    transactions,
    setTransactions,
    paymentSources,
    setPaymentSources,
    isLoading,
    setIsLoading,
  } = useFinanceState();

  const { balance, income, expense } = useFinanceCalculations(transactions);
  
  const { refreshData, setupSubscriptions } = useFinanceDataSync({
    setTransactions,
    setPaymentSources,
    setIsLoading,
  });

  const { getFormattedPaymentSources, getTransactionsBySource } = useFinanceUtils(
    paymentSources,
    transactions
  );

  const { addTransaction, editTransaction, deleteTransaction } = useTransactionOperations(
    paymentSources,
    refreshData
  );

  const { 
    addPaymentSource: addSource, 
    editPaymentSource: editSource, 
    deletePaymentSource: deleteSource 
  } = usePaymentSources();

  const addPaymentSource = async (source: Omit<PaymentSource, "id">) => {
    await addSource({
      ...source,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
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

  useEffect(() => {
    if (!user) return;
    
    const initializeData = async () => {
      try {
        await refreshData();
        return setupSubscriptions();
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, [user]);

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
        refreshData,
        addTransaction,
        editTransaction,
        deleteTransaction,
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
