import { PaymentSource } from "@/types/finance";
import { supabase } from "@/integrations/supabase/client";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validateUUID = (id: string): boolean => {
  return UUID_REGEX.test(id);
};

export const getBaseSourceId = (sourceId: string): string => {
  // Split by hyphen to handle UPI sources (e.g., "uuid-gpay")
  const parts = sourceId.split("-");
  const baseId = parts[0];
  
  // Validate the base UUID part
  if (!validateUUID(baseId)) {
    console.error("Invalid base source ID:", baseId, "from source ID:", sourceId);
    throw new Error("Invalid payment source ID format");
  }
  
  return baseId;
};

export const updatePaymentSourceAmount = async (
  sourceId: string,
  amount: number,
  isAddition: boolean
) => {
  console.log("Updating amount for source:", sourceId);
  const baseSourceId = getBaseSourceId(sourceId);
  console.log("Base source ID:", baseSourceId);

  const { data: source, error: fetchError } = await supabase
    .from("payment_sources")
    .select("*")
    .eq("id", baseSourceId)
    .single();

  if (fetchError) {
    console.error("Error fetching payment source:", fetchError);
    throw fetchError;
  }
  if (!source) {
    console.error("Payment source not found:", baseSourceId);
    throw new Error("Payment source not found");
  }

  const currentAmount = Number(source.amount) || 0;
  const newAmount = isAddition ? currentAmount + amount : currentAmount - amount;

  if (newAmount < 0) {
    console.error("Insufficient balance:", currentAmount, "Required:", amount);
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

  if (error) {
    console.error("Error updating payment source:", error);
    throw error;
  }
};

export const validateExpenseAmount = (
  paymentSources: PaymentSource[],
  sourceId: string,
  amount: number
): boolean => {
  const baseSourceId = getBaseSourceId(sourceId);
  console.log("Validating expense amount for source:", sourceId, "base:", baseSourceId);

  const source = paymentSources.find(s => s.id === baseSourceId);
  if (!source) {
    console.error("Payment source not found:", baseSourceId);
    throw new Error("Payment source not found");
  }

  const hasEnoughBalance = Number(source.amount) >= amount;
  console.log("Balance check:", {
    available: source.amount,
    required: amount,
    hasEnough: hasEnoughBalance
  });

  return hasEnoughBalance;
};

export const isUpiSource = (sourceId: string): boolean => {
  return sourceId.includes("-");
};

export const getUpiApp = (sourceId: string): string | null => {
  const parts = sourceId.split("-");
  return parts.length > 1 ? parts[1] : null;
};