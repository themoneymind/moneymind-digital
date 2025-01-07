import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionType } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
      const { error } = await supabase
        .from("transactions")
        .insert([{
          ...newTransaction,
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

  const editTransaction = useCallback(async (id: string, updates: Partial<Omit<Transaction, "id" | "created_at" | "updated_at">>) => {
    if (!user) return;

    try {
      // Ensure we have a valid UUID format
      if (!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        throw new Error("Invalid transaction ID format");
      }

      const formattedUpdates = {
        ...updates,
        date: updates.date ? updates.date.toISOString() : undefined
      };

      const { error, data } = await supabase
        .from("transactions")
        .update(formattedUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating transaction:", error);
        toast({
          title: "Error",
          description: "Failed to update transaction",
          variant: "destructive",
        });
        throw error;
      }

      if (!data) {
        throw new Error("Transaction not found");
      }

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });

      return data;
    } catch (error) {
      console.error("Error in editTransaction:", error);
      throw error;
    }
  }, [user, toast]);

  return {
    fetchTransactions,
    addTransaction,
    editTransaction,
  };
};