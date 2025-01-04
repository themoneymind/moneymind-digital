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
      // 1. Check if source account has sufficient balance
      const { data: sourceAccount, error: sourceError } = await supabase
        .from('payment_sources')
        .select('amount')
        .eq('id', baseFromSourceId)
        .gt('amount', amount - 0.01)
        .single();

      if (sourceError || !sourceAccount) {
        throw new Error("Insufficient balance or source account not found");
      }

      // 2. Deduct from source account using RPC
      const { error: debitError } = await supabase
        .rpc('decrement_amount', { 
          source_id: baseFromSourceId,
          decrement_by: amount 
        });

      if (debitError) {
        throw new Error("Failed to deduct amount from source account");
      }

      // 3. Add to destination account using RPC
      const { error: creditError } = await supabase
        .rpc('increment_amount', { 
          source_id: baseToSourceId,
          increment_by: amount 
        });

      if (creditError) {
        throw new Error("Failed to add amount to destination account");
      }

      // 4. Create transfer transaction record
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
        await supabase
          .rpc('increment_amount', { 
            source_id: baseFromSourceId,
            increment_by: amount 
          });

        // Rollback credit operation
        await supabase
          .rpc('decrement_amount', { 
            source_id: baseToSourceId,
            decrement_by: amount 
          });
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