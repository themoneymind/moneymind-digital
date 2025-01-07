import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentSource } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type PaymentSourceResult = {
  data: PaymentSource | null;
  error: Error | null;
};

export const usePaymentSources = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPaymentSources = useCallback(async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("payment_sources")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching payment sources:", error);
      return [];
    }

    return data || [];
  }, [user]);

  const addPaymentSource = useCallback(async (newSource: Omit<PaymentSource, "id">): Promise<PaymentSourceResult> => {
    if (!user) return { data: null, error: new Error("No user found") };

    const { data, error } = await supabase
      .from("payment_sources")
      .insert([{
        ...newSource,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      console.error("Error adding payment source:", error);
      return { data: null, error };
    }

    return { data, error: null };
  }, [user]);

  const editPaymentSource = useCallback(async (updatedSource: PaymentSource) => {
    if (!user) return;

    console.log("Updating payment source:", updatedSource);

    const { 
      id,
      name,
      type,
      amount,
      linked,
      upi_apps,
      credit_limit,
      statement_date,
      due_date,
      interest_rate,
      last_four_digits
    } = updatedSource;

    const { error } = await supabase
      .from("payment_sources")
      .update({
        name,
        type,
        amount: Number(amount),
        linked,
        upi_apps,
        credit_limit,
        statement_date,
        due_date,
        interest_rate,
        last_four_digits
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating payment source:", error);
      throw error;
    }
  }, [user]);

  const deletePaymentSource = useCallback(async (id: string) => {
    if (!user) return;

    // First, delete all related transactions
    const { error: transactionsError } = await supabase
      .from("transactions")
      .delete()
      .eq("base_source_id", id);

    if (transactionsError) {
      console.error("Error deleting related transactions:", transactionsError);
      throw transactionsError;
    }

    // Then delete the payment source
    const { error } = await supabase
      .from("payment_sources")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting payment source:", error);
      throw error;
    }
  }, [user]);

  return {
    fetchPaymentSources,
    addPaymentSource,
    editPaymentSource,
    deletePaymentSource,
  };
};