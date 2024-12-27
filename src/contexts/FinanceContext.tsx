import React, { createContext, useContext, useState, useCallback } from "react";
import { NewPaymentSource, PaymentSource, Transaction } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { paymentSourcesApi } from "@/api/paymentSourcesApi";
import { useAuth } from "@/contexts/AuthContext";

const FinanceContext = createContext<any>(null);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [paymentSources, setPaymentSources] = useState<PaymentSource[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const refreshData = async () => {
    // Fetch and set payment sources
    const sources = await paymentSourcesApi.fetchPaymentSources();
    setPaymentSources(sources);
  };

  const addPaymentSource = useCallback(async (newSource: NewPaymentSource) => {
    try {
      await paymentSourcesApi.addPaymentSource({
        ...newSource,
        user_id: user?.id || '',
      });
      await refreshData();
      toast({
        title: "Success",
        description: "Payment source added successfully",
      });
    } catch (error) {
      console.error("Error adding payment source:", error);
      toast({
        title: "Error",
        description: "Failed to add payment source",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, refreshData, toast]);

  return (
    <FinanceContext.Provider 
      value={{ 
        paymentSources, 
        addPaymentSource, 
        refreshData,
        transactions,
        setTransactions,
        currentMonth,
        setCurrentMonth
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};