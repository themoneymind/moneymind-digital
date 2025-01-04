import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

    try {
      // 1. Deduct from source account
      const { data: debitData, error: debitError } = await supabase
        .from('payment_sources')
        .update({ amount: amount * -1 })
        .eq('id', fromSourceId)
        .gt('amount', amount - 0.01)
        .select('amount')
        .single();

      if (debitError) {
        throw new Error("Insufficient balance or source account not found");
      }

      // 2. Add to destination account
      const { data: creditData, error: creditError } = await supabase
        .from('payment_sources')
        .update({ amount: amount })
        .eq('id', toSourceId)
        .select('amount')
        .single();

      if (creditError) {
        throw new Error("Destination account not found");
      }

      // 3. Create outgoing transaction record
      const { error: outgoingError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          type: 'transfer',
          amount: amount,
          category: 'Transfer',
          source: fromSourceId,
          base_source_id: fromSourceId,
          display_source: toSourceId,
          description: description || 'Transfer',
          date: new Date().toISOString(),
        }]);

      if (outgoingError) {
        throw new Error("Failed to record outgoing transfer");
      }

      // 4. Create incoming transaction record
      const { error: incomingError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          type: 'income',
          amount: amount,
          category: 'Transfer',
          source: toSourceId,
          base_source_id: toSourceId,
          display_source: fromSourceId,
          description: `Transfer from ${description || 'account'}`,
          date: new Date().toISOString(),
        }]);

      if (incomingError) {
        throw new Error("Failed to record incoming transfer");
      }

      toast.success("Transfer completed successfully");
      return true;

    } catch (error) {
      // Rollback on any error
      try {
        // Rollback debit operation
        await supabase
          .from('payment_sources')
          .update({ amount: amount })
          .eq('id', fromSourceId);

        // Rollback credit operation
        await supabase
          .from('payment_sources')
          .update({ amount: amount * -1 })
          .eq('id', toSourceId);
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