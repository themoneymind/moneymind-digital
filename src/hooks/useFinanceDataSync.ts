import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "./useTransactions";
import { usePaymentSources } from "./usePaymentSources";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, AuditTrailEntry, RepeatOption } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";

type DataSyncProps = {
  setTransactions: (transactions: Transaction[]) => void;
  setPaymentSources: (sources: PaymentSource[]) => void;
  setIsLoading: (loading: boolean) => void;
};

export const useFinanceDataSync = ({
  setTransactions,
  setPaymentSources,
  setIsLoading,
}: DataSyncProps) => {
  const { user } = useAuth();
  const { fetchTransactions } = useTransactions();
  const { fetchPaymentSources } = usePaymentSources();

  const refreshData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const [txnsData, sources] = await Promise.all([
        fetchTransactions(),
        fetchPaymentSources()
      ]);

      // Transform the audit_trail and ensure repeat_frequency is properly typed
      const txns = txnsData.map(t => ({
        ...t,
        audit_trail: t.audit_trail?.map((entry: any) => ({
          action: entry.action,
          timestamp: entry.timestamp
        })) as AuditTrailEntry[],
        repeat_frequency: (t.repeat_frequency || 'never') as RepeatOption
      }));

      setTransactions(txns);
      setPaymentSources(sources);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupSubscriptions = () => {
    if (!user) return;

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
  };

  return { refreshData, setupSubscriptions };
};