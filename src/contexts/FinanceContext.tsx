import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  addTransaction: (transaction: Omit<Transaction, "id" | "date">) => Promise<void>;
  editTransaction: (id: string, updates: Partial<Omit<Transaction, "id">>) => Promise<void>;
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
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentSources, setPaymentSources] = useState<PaymentSource[]>([]);

  // Fetch payment sources
  useEffect(() => {
    if (!user) return;

    const fetchPaymentSources = async () => {
      const { data, error } = await supabase
        .from("payment_sources")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching payment sources:", error);
        return;
      }

      setPaymentSources(data || []);
    };

    fetchPaymentSources();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('payment_sources_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_sources',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchPaymentSources();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Fetch transactions
  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        return;
      }

      setTransactions(data.map(t => ({
        ...t,
        date: new Date(t.date)
      })) || []);
    };

    fetchTransactions();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const balance = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const income = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + curr.amount : acc;
  }, 0);

  const expense = transactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + curr.amount : acc;
  }, 0);

  const addTransaction = useCallback(async (newTransaction: Omit<Transaction, "id" | "date">) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("transactions")
      .insert([{
        ...newTransaction,
        user_id: user.id,
        date: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
      return;
    }

    // Update payment source amount
    const sourceId = newTransaction.source.split('-')[0];
    const { error: sourceError } = await supabase
      .from("payment_sources")
      .update({
        amount: newTransaction.type === 'expense' 
          ? paymentSources.find(s => s.id === sourceId)!.amount - newTransaction.amount
          : paymentSources.find(s => s.id === sourceId)!.amount + newTransaction.amount
      })
      .eq("id", sourceId);

    if (sourceError) {
      console.error("Error updating payment source:", sourceError);
      toast({
        title: "Error",
        description: "Failed to update payment source",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Transaction added successfully",
    });
  }, [user, paymentSources, toast]);

  const editTransaction = useCallback(async (id: string, updates: Partial<Omit<Transaction, "id">>) => {
    if (!user) return;

    const { error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Transaction updated successfully",
    });
  }, [user, toast]);

  const addPaymentSource = useCallback(async (newSource: Omit<PaymentSource, "id">) => {
    if (!user) return;

    const { error } = await supabase
      .from("payment_sources")
      .insert([{
        ...newSource,
        user_id: user.id
      }]);

    if (error) {
      console.error("Error adding payment source:", error);
      toast({
        title: "Error",
        description: "Failed to add payment source",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Payment source added successfully",
    });
  }, [user, toast]);

  const editPaymentSource = useCallback(async (updatedSource: PaymentSource) => {
    if (!user) return;

    const { error } = await supabase
      .from("payment_sources")
      .update(updatedSource)
      .eq("id", updatedSource.id);

    if (error) {
      console.error("Error updating payment source:", error);
      toast({
        title: "Error",
        description: "Failed to update payment source",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Payment source updated successfully",
    });
  }, [user, toast]);

  const deletePaymentSource = useCallback(async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("payment_sources")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting payment source:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment source",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Payment source deleted successfully",
    });
  }, [user, toast]);

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