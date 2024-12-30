import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, RepeatOption } from "@/types/transactions";

export const useReport = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  return { transactions, isLoading };
};
