import { PaymentSource } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";

export const updatePaymentSourceAmount = async (
  sourceId: string,
  amount: number,
  isAddition: boolean
) => {
  const { data: source } = await supabase
    .from("payment_sources")
    .select("*")
    .eq("id", sourceId)
    .single();

  if (!source) return;

  const currentAmount = Number(source.amount) || 0;
  const newAmount = isAddition ? currentAmount + amount : currentAmount - amount;

  const updatedSource = {
    ...source,
    amount: newAmount
  };

  const { error } = await supabase
    .from("payment_sources")
    .update(updatedSource)
    .eq("id", sourceId);

  if (error) throw error;
};

export const validateExpenseAmount = (
  paymentSources: PaymentSource[],
  sourceId: string,
  amount: number
): boolean => {
  const source = paymentSources.find(s => s.id === sourceId);
  return source ? Number(source.amount) >= amount : false;
};