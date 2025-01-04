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

    // Start a Supabase transaction
    const { data: client } = await supabase.rpc('begin');

    try {
      // 1. Deduct from source account
      const { error: debitError } = await supabase
        .from('payment_sources')
        .update({ 
          amount: supabase.raw('amount - ?', [amount])
        })
        .eq('id', fromSourceId)
        .gt('amount', amount - 0.01); // Ensure sufficient balance

      if (debitError) {
        throw new Error("Insufficient balance or source account not found");
      }

      // 2. Add to destination account
      const { error: creditError } = await supabase
        .from('payment_sources')
        .update({ 
          amount: supabase.raw('amount + ?', [amount])
        })
        .eq('id', toSourceId);

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

      await supabase.rpc('commit');
      toast.success("Transfer completed successfully");
      return true;

    } catch (error) {
      // Rollback on any error
      await supabase.rpc('rollback');
      
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