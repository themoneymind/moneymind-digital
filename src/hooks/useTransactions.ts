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
  }, [user]);

  const addTransaction = useCallback(async (newTransaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">) => {
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

    toast({
      title: "Success",
      description: "Transaction added successfully",
    });

    return data;
  }, [user, toast]);

  const editTransaction = useCallback(async (id: string, updates: Partial<Omit<Transaction, "id" | "created_at" | "updated_at">>) => {
    if (!user) return;

    const formattedUpdates = {
      ...updates,
      date: updates.date ? updates.date.toISOString() : undefined
    };

    const { error } = await supabase
      .from("transactions")
      .update(formattedUpdates)
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

  return {
    fetchTransactions,
    addTransaction,
    editTransaction,
  };
};