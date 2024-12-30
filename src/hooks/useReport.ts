import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, RepeatOption } from "@/types/transactions";

type TimeframeType = "daily" | "weekly" | "monthly" | "yearly";

export const useReport = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<TimeframeType>("monthly");
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      try {
        const { data: txnsData, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        // Transform the transactions to match our TypeScript type
        const txns = txnsData.map(t => ({
          ...t,
          date: new Date(t.date),
          repeat_frequency: (t.repeat_frequency || 'never') as RepeatOption
        }));

        setTransactions(txns as Transaction[]);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const prepareChartData = () => {
    // Implementation of chart data preparation based on timeframe
    return transactions.map(t => ({
      date: t.date.toLocaleDateString(),
      amount: Number(t.amount)
    }));
  };

  const downloadReport = (format: 'excel' | 'pdf') => {
    // Implementation of report download functionality
    console.log(`Downloading ${format} report...`);
  };

  return { 
    transactions, 
    isLoading, 
    timeframe, 
    setTimeframe, 
    prepareChartData, 
    downloadReport 
  };
};