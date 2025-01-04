import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

export const useTransferHandler = () => {
  const { user } = useAuth();

  const handleTransfer = async (
    fromSourceId: string,
    toSourceId: string,
    amount: number,
    description: string
  ) => {
    if (!user) {
      toast.error("User not authenticated");
      return false;
    }

    // Get base source IDs for both accounts
    const baseFromSourceId = getBaseSourceId(fromSourceId);
    const baseToSourceId = getBaseSourceId(toSourceId);

    console.log("Transfer details:", {
      fromSourceId,
      toSourceId,
      baseFromSourceId,
      baseToSourceId,
      amount
    });

    try {
      // 1. Deduct from source account
      const { data: debitData, error: debitError } = await supabase.rpc(
        'decrement_amount',
        { decrement_by: amount }
      ).from('payment_sources')
        .eq('id', baseFromSourceId)
        .gt('amount', amount - 0.01)
        .select('amount')
        .single();

      if (debitError) {
        throw new Error("Insufficient balance or source account not found");
      }

      // 2. Add to destination account
      const { data: creditData, error: creditError } = await supabase.rpc(
        'increment_amount',
        { increment_by: amount }
      ).from('payment_sources')
        .eq('id', baseToSourceId)
        .select('amount')
        .single();

      if (creditError) {
        throw new Error("Destination account not found");
      }

      // 3. Create transfer transaction record
      const { error: transferError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          type: 'transfer',
          amount: amount,
          category: 'Transfer',
          source: fromSourceId,
          base_source_id: baseFromSourceId,
          display_source: toSourceId,
          description: description || 'Transfer',
          date: new Date().toISOString(),
        }]);

      if (transferError) {
        throw new Error("Failed to record transfer");
      }

      toast.success("Transfer completed successfully");
      return true;

    } catch (error) {
      // Rollback on any error
      try {
        // Rollback debit operation
        await supabase.rpc(
          'increment_amount',
          { increment_by: amount }
        ).from('payment_sources')
          .eq('id', baseFromSourceId);

        // Rollback credit operation
        await supabase.rpc(
          'decrement_amount',
          { decrement_by: amount }
        ).from('payment_sources')
          .eq('id', baseToSourceId);
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
        toast.error("Critical error during rollback. Please contact support.");
      }
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Transfer failed");
      }
      
      return false;
    }
  };

  return { handleTransfer };
};