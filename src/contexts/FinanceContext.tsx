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

  useEffect(() => {
    if (!user) return;
    loadPaymentSources();
  }, [user, fetchPaymentSources]);

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

  const updatePaymentSourceAmount = async (sourceId: string, amount: number, isAddition: boolean) => {
    const sourceIndex = paymentSources.findIndex(s => s.id === sourceId);
    if (sourceIndex === -1) return;

    const source = paymentSources[sourceIndex];
    const currentAmount = Number(source.amount) || 0;
    const newAmount = isAddition ? currentAmount + amount : currentAmount - amount;

    const updatedSource = {
      ...source,
      amount: newAmount
    };

    await editSource(updatedSource);
    await loadPaymentSources(); // Refresh payment sources
  };

  const addTransaction = async (transaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">) => {
    try {
      // First, validate if there's enough balance for expense
      if (transaction.type === 'expense') {
        const source = paymentSources.find(s => s.id === transaction.source);
        if (!source || Number(source.amount) < Number(transaction.amount)) {
          throw new Error("Insufficient balance in the selected payment source");
        }
      }

      // Add the transaction
      await addTxn(transaction);

      // Update payment source amount
      await updatePaymentSourceAmount(
        transaction.source,
        Number(transaction.amount),
        transaction.type === 'income'
      );

      // Refresh data
      await Promise.all([loadTransactions(), loadPaymentSources()]);
    } catch (error) {
      console.error("Error in addTransaction:", error);
      throw error;
    }
  };

  const editTransaction = async (id: string, updates: Partial<Omit<Transaction, "id" | "created_at" | "updated_at">>) => {
    try {
      // Get the original transaction
      const originalTransaction = transactions.find(t => t.id === id);
      if (!originalTransaction) throw new Error("Transaction not found");

      // If amount or type is being updated, we need to adjust payment source
      if (updates.amount || updates.type || updates.source) {
        // Revert the original transaction's effect on payment source
        await updatePaymentSourceAmount(
          originalTransaction.source,
          Number(originalTransaction.amount),
          originalTransaction.type === 'expense' // Reverse the original effect
        );

        // Apply the new transaction's effect
        const newAmount = updates.amount || originalTransaction.amount;
        const newType = updates.type || originalTransaction.type;
        const newSource = updates.source || originalTransaction.source;

        await updatePaymentSourceAmount(
          newSource,
          Number(newAmount),
          newType === 'income'
        );
      }

      await editTxn(id, updates);
      await Promise.all([loadTransactions(), loadPaymentSources()]);
    } catch (error) {
      console.error("Error in editTransaction:", error);
      throw error;
    }
  };

  const editPaymentSource = async (source: PaymentSource) => {
    try {
      const originalSource = paymentSources.find(s => s.id === source.id);
      if (!originalSource) throw new Error("Payment source not found");

      // Calculate the difference in amount
      const amountDifference = Number(source.amount) - Number(originalSource.amount);

      // Update the payment source
      await editSource(source);

      // If there's a change in amount, we need to reflect this in the total balance
      if (amountDifference !== 0) {
        // Create an adjustment transaction
        await addTxn({
          type: amountDifference > 0 ? 'income' : 'expense',
          amount: Math.abs(amountDifference),
          category: 'Balance Adjustment',
          source: source.id,
          description: `Balance adjustment for ${source.name}`,
        });
      }

      await Promise.all([loadPaymentSources(), loadTransactions()]);
    } catch (error) {
      console.error("Error in editPaymentSource:", error);
      throw error;
    }
  };

  const addPaymentSource = async (source: Omit<PaymentSource, "id">) => {
    await addSource(source);
    await loadPaymentSources();
  };

  const deletePaymentSource = async (id: string) => {
    await deleteSource(id);
    await loadPaymentSources();
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