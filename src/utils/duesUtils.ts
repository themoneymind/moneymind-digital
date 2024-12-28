import { DueTransaction } from "@/types/dues";
import { getBaseSourceId } from "./paymentSourceUtils";

export const formatDuesCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const createAuditEntry = (previousStatus: string, newStatus: string) => ({
  action: `Status changed from ${previousStatus} to ${newStatus}`,
  timestamp: new Date().toISOString(),
});

export const cleanSourceId = (sourceId: string | null | undefined): string => {
  if (!sourceId) return '';
  return getBaseSourceId(sourceId);
};