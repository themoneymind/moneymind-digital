import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Transaction } from "@/types/transactions";
import { TransactionEditDialogContent } from "./TransactionEditDialogContent";

interface TransactionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
}

export const TransactionEditDialog = ({
  open,
  onOpenChange,
  transaction,
}: TransactionEditDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <TransactionEditDialogContent
          transaction={transaction}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
};