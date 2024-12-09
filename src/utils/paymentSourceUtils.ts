import { PaymentSource } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validateUUID = (id: string): boolean => {
  return UUID_REGEX.test(id);
};

export const getBaseSourceId = (sourceId: string): string => {
  // If it's already a valid UUID, return it as is
  if (validateUUID(sourceId)) {
    return sourceId;
  }
  
  // If it contains a hyphen, get the part before it and validate
  const baseId = sourceId.split("-")[0];
  if (!validateUUID(baseId)) {
    throw new Error("Invalid payment source ID format");
  }
  return baseId;
};

export const updatePaymentSourceAmount = async (
  sourceId: string,
  amount: number,
  isAddition: boolean
) => {
  const baseSourceId = getBaseSourceId(sourceId);
  if (!validateUUID(baseSourceId)) {
    throw new Error("Invalid payment source ID format");
  }

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
  const baseSourceId = getBaseSourceId(sourceId);
  if (!validateUUID(baseSourceId)) {
    throw new Error("Invalid payment source ID format");
  }

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