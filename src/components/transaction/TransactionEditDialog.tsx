import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Transaction } from "@/types/finance";
import { TransactionEditDialogForm } from "./TransactionEditDialogForm";
import { useCallback } from "react";

type TransactionEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
};

export const TransactionEditDialog = ({
  open,
  onOpenChange,
  transaction,
}: TransactionEditDialogProps) => {
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setTimeout(() => {
        onOpenChange(open);
      }, 100);
    } else {
      onOpenChange(open);
    }
  }, [onOpenChange]);

  const handleClose = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0 bg-white rounded-[20px]">
        <TransactionEditDialogForm 
          transaction={transaction} 
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};