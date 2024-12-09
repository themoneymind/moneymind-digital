import { PaymentSource } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validateUUID = (id: string): boolean => {
  return UUID_REGEX.test(id);
};

export const getBaseSourceId = (sourceId: string): string => {
  // Extract the base payment source ID (everything before any "-" if it exists)
  return sourceId.split("-")[0];
};

export const updatePaymentSourceAmount = async (
  sourceId: string,
  amount: number,
  isAddition: boolean
) => {
  if (!validateUUID(sourceId)) {
    throw new Error("Invalid payment source ID format");
  }

  // Always use the base source ID for amount updates
  const baseSourceId = getBaseSourceId(sourceId);

  const { data: source, error: fetchError } = await supabase
    .from("payment_sources")
    .select("*")
    .eq("id", baseSourceId)
    .single();

  if (fetchError) throw fetchError;
  if (!source) throw new Error("Payment source not found");

  const currentAmount = Number(source.amount) || 0;
  const newAmount = isAddition ? currentAmount + amount : currentAmount - amount;

  if (newAmount < 0) {
    throw new Error("Insufficient balance in the payment source");
  }

  const updatedSource = {
    ...source,
    amount: newAmount
  };

  const { error } = await supabase
    .from("payment_sources")
    .update(updatedSource)
    .eq("id", baseSourceId);

  if (error) throw error;
};

export const validateExpenseAmount = (
  paymentSources: PaymentSource[],
  sourceId: string,
  amount: number
): boolean => {
  if (!validateUUID(getBaseSourceId(sourceId))) {
    throw new Error("Invalid payment source ID format");
  }

  // Get the base source ID to check balance
  const baseSourceId = getBaseSourceId(sourceId);
  const source = paymentSources.find(s => s.id === baseSourceId);
  
  if (!source) {
    throw new Error("Payment source not found");
  }

  return Number(source.amount) >= amount;
};

export const isUpiSource = (sourceId: string): boolean => {
  return sourceId.includes("-");
};

export const getUpiApp = (sourceId: string): string | null => {
  const parts = sourceId.split("-");
  return parts.length > 1 ? parts[1] : null;
};