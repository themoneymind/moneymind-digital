import { Transaction } from "@/types/transactions";
import { PaymentSource } from "@/types/finance";
import { useTransactionSourceUpdate } from "./useTransactionSourceUpdate";
import { useAuth } from "@/contexts/AuthContext";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";
import { useTransferOperation } from "./useTransferOperation";
import { useRegularTransaction } from "./useRegularTransaction";
import { toast } from "sonner";

export const useTransactionAdd = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();
  const { updatePaymentSourceAmount } = useTransactionSourceUpdate(paymentSources);
  const { handleTransfer } = useTransferOperation(updatePaymentSourceAmount);
  const { handleRegularTransaction } = useRegularTransaction(updatePaymentSourceAmount);

  const addTransaction = async (newTransaction: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return;

    try {
      console.log("Starting transaction add:", { 
        type: newTransaction.type,
        source: newTransaction.source,
        displaySource: newTransaction.display_source,
        amount: newTransaction.amount 
      });

      // Get base source IDs for both source and destination
      const sourceBaseId = getBaseSourceId(newTransaction.source);
      const destinationBaseId = newTransaction.display_source ? getBaseSourceId(newTransaction.display_source) : null;

      console.log("Base source IDs:", { sourceBaseId, destinationBaseId });

      let success;
      if (newTransaction.type === "transfer") {
        success = await handleTransfer(
          sourceBaseId,
          destinationBaseId,
          Number(newTransaction.amount),
          user.id,
          newTransaction
        );
      } else {
        success = await handleRegularTransaction(
          sourceBaseId,
          Number(newTransaction.amount),
          newTransaction.type,
          user.id,
          newTransaction
        );
      }

      if (success) {
        await refreshData();
        toast.success("Transaction added successfully");
      }
    } catch (error) {
      console.error("Error in addTransaction:", error);
      throw error;
    }
  };

  return { addTransaction };
};