import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentSource } from "@/types/finance";
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

  const addPaymentSource = useCallback(async (newSource: Omit<PaymentSource, "id">) => {
    if (!user) return;

    const { error } = await supabase
      .from("payment_sources")
      .insert([{
        ...newSource,
        user_id: user.id
      }]);

    if (error) {
      console.error("Error adding payment source:", error);
      toast({
        title: "Error",
        description: "Failed to add payment source",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Payment source added successfully",
    });
  }, [user, toast]);

  const editPaymentSource = useCallback(async (updatedSource: PaymentSource) => {
    if (!user) return;

    const { error } = await supabase
      .from("payment_sources")
      .update(updatedSource)
      .eq("id", updatedSource.id);

    if (error) {
      console.error("Error updating payment source:", error);
      toast({
        title: "Error",
        description: "Failed to update payment source",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Payment source updated successfully",
    });
  }, [user, toast]);

  const deletePaymentSource = useCallback(async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("payment_sources")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting payment source:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment source",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Payment source deleted successfully",
    });
  }, [user, toast]);

  return {
    fetchPaymentSources,
    addPaymentSource,
    editPaymentSource,
    deletePaymentSource,
  };
};