import { useFinance } from "@/contexts/FinanceContext";
import { toast } from "sonner";
import { Transaction } from "@/types/transactions";

export const useTransferHandling = () => {
  const { addTransaction } = useFinance();

  const handleTransfer = async (
    fromSourceId: string,
    toSourceId: string,
    amount: number,
    description: string,
    date: Date,
    displayFromSource: string,
    displayToSource: string,
  ) => {
    try {
      // Create outgoing transfer transaction
      await addTransaction({
        type: "transfer",
        amount,
        category: "Transfer",
        source: fromSourceId,
        description,
        base_source_id: fromSourceId,
        display_source: displayToSource,
        date,
      });

      // Create incoming transfer transaction
      await addTransaction({
        type: "transfer",
        amount,
        category: "Transfer",
        source: toSourceId,
        description,
        base_source_id: toSourceId,
        display_source: displayFromSource,
        date,
      });

      toast.success("Transfer completed successfully");
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("Failed to complete transfer");
      throw error;
    }
  };

  return { handleTransfer };
};