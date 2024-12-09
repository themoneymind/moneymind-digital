import { PaymentSource } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validateUUID = (id: string): boolean => {
  return UUID_REGEX.test(id);
};

export const updatePaymentSourceAmount = async (
  sourceId: string,
  amount: number,
  isAddition: boolean
) => {
  if (!validateUUID(sourceId)) {
    throw new Error("Invalid payment source ID format");
  }

  const { data: source, error: fetchError } = await supabase
    .from("payment_sources")
    .select("*")
    .eq("id", sourceId)
    .single();

  if (fetchError) throw fetchError;
  if (!source) throw new Error("Payment source not found");

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
  if (!validateUUID(sourceId)) {
    throw new Error("Invalid payment source ID format");
  }

  const source = paymentSources.find(s => s.id === sourceId);
  return source ? Number(source.amount) >= amount : false;
};