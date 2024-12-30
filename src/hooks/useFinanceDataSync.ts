import { useTransactions } from "./useTransactions";
import { usePaymentSources } from "./usePaymentSources";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, AuditTrailEntry, RepeatOption } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";

type DataSyncProps = {
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setPaymentSources: React.Dispatch<React.SetStateAction<PaymentSource[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useFinanceDataSync = ({
  setTransactions,
  setPaymentSources,
  setIsLoading,
}: DataSyncProps) => {
  const { fetchTransactions } = useTransactions();
  const { fetchPaymentSources } = usePaymentSources();

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [txnsData, sourcesData] = await Promise.all([
        fetchTransactions(),
        fetchPaymentSources()
      ]);

      // Transform the data with proper typing
      const txns = txnsData.map(t => ({
        ...t,
        audit_trail: t.audit_trail?.map((entry: any) => ({
          action: entry.action,
          timestamp: entry.timestamp
        })) as AuditTrailEntry[],
        repeat_frequency: (t.repeat_frequency || 'never') as RepeatOption
      }));

      setTransactions(txns);
      setPaymentSources(sourcesData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupSubscriptions = () => {
    // Subscribe to changes in transactions and payment sources using channels
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => refreshData()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payment_sources' },
        () => refreshData()
      )
      .subscribe();

    return () => {
      supabase.channel('db-changes').unsubscribe();
    };
  };

  return {
    refreshData,
    setupSubscriptions,
  };
};