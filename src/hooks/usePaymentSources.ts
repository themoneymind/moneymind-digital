import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentSource, NewPaymentSource } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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

  const addPaymentSource = useCallback(async (newSource: NewPaymentSource) => {
    if (!user) return;

    const { error } = await supabase
      .from("payment_sources")
      .insert({
        ...newSource,
        user_id: user.id
      });

    if (error) {
      console.error("Error adding payment source:", error);
      throw error;
    }
  }, [user]);

  const editPaymentSource = useCallback(async (updatedSource: PaymentSource) => {
    if (!user) return;

    console.log("Updating payment source:", updatedSource);

    const { error } = await supabase
      .from("payment_sources")
      .update({
        ...updatedSource,
        amount: Number(updatedSource.amount)
      })
      .eq("id", updatedSource.id);

    if (error) {
      console.error("Error updating payment source:", error);
      throw error;
    }
  }, [user]);

  const deletePaymentSource = useCallback(async (id: string) => {
    if (!user) return;

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