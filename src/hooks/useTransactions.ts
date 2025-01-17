import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionType } from "@/types/finance";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

export const useTransactions = () => {
  const { user } = useAuth();

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
        toast.error("Failed to add transaction");
        throw error;
      }

      toast.success("Transaction added successfully");
    } catch (error) {
      console.error("Error in addTransaction:", error);
      throw error;
    }
  }, [user]);

  const editTransaction = useCallback(async (id: string, updates: Partial<Omit<Transaction, "id" | "created_at" | "updated_at">>) => {
    if (!user) return;

    try {
      const formattedUpdates: any = {
        ...updates,
        date: updates.date ? updates.date.toISOString() : undefined
      };

      if (updates.source) {
        formattedUpdates.base_source_id = getBaseSourceId(updates.source);
        formattedUpdates.display_source = updates.source;
      }

      const { error: updateError } = await supabase
        .from("transactions")
        .update(formattedUpdates)
        .eq("id", id);

      if (updateError) {
        console.error("Error updating transaction:", updateError);
        toast.error("Failed to update transaction");
        throw updateError;
      }

      toast.success("Transaction updated successfully");
    } catch (error) {
      console.error("Error in editTransaction:", error);
      throw error;
    }
  }, [user]);

  return {
    fetchTransactions,
    addTransaction,
    editTransaction,
  };
};