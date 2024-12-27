import { supabase } from "@/integrations/supabase/client";
import { PaymentSource, NewPaymentSource } from "@/types/finance";

export const paymentSourcesApi = {
  fetchPaymentSources: async (): Promise<PaymentSource[]> => {
    const { data, error } = await supabase
      .from("payment_sources")
      .select("*");

    if (error) {
      console.error("Error fetching payment sources:", error);
      throw error;
    }

    return data || [];
  },

  addPaymentSource: async (source: NewPaymentSource): Promise<void> => {
    const { error } = await supabase
      .from("payment_sources")
      .insert(source);

    if (error) {
      console.error("Error adding payment source:", error);
      throw error;
    }
  },
};