import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionType } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

export const useTransactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        return [];
      }

      return (data || []).map(t => ({
        ...t,
        type: t.type as TransactionType,
        date: new Date(t.date),
      }));
    } catch (error) {
      console.error("Error in fetchTransactions:", error);
      return [];
    }
  }, [user]);

  const addTransaction = useCallback(async (newTransaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return;

    try {
      const baseSourceId = getBaseSourceId(newTransaction.source);
      
      const { error } = await supabase
        .from("transactions")
        .insert([{
          ...newTransaction,
          base_source_id: baseSourceId,
          display_source: newTransaction.source,
          user_id: user.id,
          date: new Date().toISOString()
        }]);

      if (error) {
        console.error("Error adding transaction:", error);
        toast({
          title: "Error",
          description: "Failed to add transaction",
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } catch (error) {
      console.error("Error in addTransaction:", error);
      throw error;
    }
  }, [user, toast]);

  return {
    fetchTransactions,
    addTransaction,
    editTransaction,
  };
};