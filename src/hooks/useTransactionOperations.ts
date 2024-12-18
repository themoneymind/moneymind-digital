import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/finance";
import { PaymentSource } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useTransactionOperations = (
  paymentSources: PaymentSource[],
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "date" | "user_id" | "created_at" | "updated_at">
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("transactions")
        .insert([{
          ...transaction,
          user_id: user.id,
          date: new Date().toISOString()
        }]);

      if (error) {
        console.error("Error adding transaction:", error);
        toast({
          title: "Error",
          description: "Failed to add transaction",
          variant: "destructive",
        });
        throw error;
      }

      await refreshData();
      
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } catch (error) {
      console.error("Error in addTransaction:", error);
      throw error;
    }
  };

  const editTransaction = async (
    id: string,
    updates: Partial<Omit<Transaction, "id" | "created_at" | "updated_at">>
  ) => {
    if (!user) return;

    try {
      // Convert Date object to ISO string if it exists
      const formattedUpdates = {
        ...updates,
        date: updates.date ? new Date(updates.date).toISOString() : undefined
      };

      const { error } = await supabase
        .from("transactions")
        .update(formattedUpdates)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating transaction:", error);
        toast({
          title: "Error",
          description: "Failed to update transaction",
          variant: "destructive",
        });
        throw error;
      }

      await refreshData();
      
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (error) {
      console.error("Error in editTransaction:", error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error deleting transaction:", error);
        toast({
          title: "Error",
          description: "Failed to delete transaction",
          variant: "destructive",
        });
        throw error;
      }

      await refreshData();
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteTransaction:", error);
      throw error;
    }
  };

  return {
    addTransaction,
    editTransaction,
    deleteTransaction,
  };
};