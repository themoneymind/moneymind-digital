import { PaymentSource } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";

export const getBaseSourceId = (source: string): string => {
  // Split by hyphen and take the first two parts (bank-id)
  const parts = source.split('-');
  return parts.length > 1 ? `${parts[0]}-${parts[1]}` : source;
};

export const updatePaymentSourceAmount = async (
  sourceId: string,
  amount: number,
  type: "income" | "expense",
  isReversal: boolean = false
) => {
  const { data: source, error: fetchError } = await supabase
    .from("payment_sources")
    .select("*")
    .eq("id", sourceId)
    .single();

  if (fetchError) throw fetchError;
  if (!source) return;

  let newAmount;
  if (isReversal) {
    newAmount = type === "income" 
      ? Number(source.amount) - Number(amount)
      : Number(source.amount) + Number(amount);
  } else {
    newAmount = type === "income" 
      ? Number(source.amount) + Number(amount)
      : Number(source.amount) - Number(amount);
  }

  const { error } = await supabase
    .from("payment_sources")
    .update({ amount: newAmount })
    .eq("id", sourceId);

  if (error) throw error;
};