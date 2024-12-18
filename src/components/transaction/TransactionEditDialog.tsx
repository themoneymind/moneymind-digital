import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { TransactionDialogContent } from "./TransactionDialogContent";
import { Transaction } from "@/types/transactions";

type TransactionEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
  onDelete?: () => void;
};

export const TransactionEditDialog = ({
  open,
  onOpenChange,
  transaction,
  onDelete,
}: TransactionEditDialogProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetState = useCallback(() => {
    setDescription(transaction?.description || "");
    setAmount(transaction?.amount || 0);
    setIsSubmitting(false);
  }, [transaction]);

  useEffect(() => {
    if (open) {
      resetState();
    }
  }, [open, resetState]);

  const handleSave = async () => {
    if (!description.trim() || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter valid description and amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Save transaction logic here
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast({
        title: "Error",
        description: "Failed to save transaction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      setIsSubmitting(true);
      try {
        await onDelete();
        onOpenChange(false);
      } catch (error) {
        console.error("Error deleting transaction:", error);
        toast({
          title: "Error",
          description: "Failed to delete transaction",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Transaction</DialogTitle>
        </DialogHeader>
        <TransactionDialogContent
          description={description}
          setDescription={setDescription}
          amount={amount}
          setAmount={setAmount}
          onSave={handleSave}
          onDelete={handleDelete}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};