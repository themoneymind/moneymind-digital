import { Transaction } from "@/types/transactions";
import { TransactionEditSheet } from "./TransactionEditSheet";

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
    <TransactionEditSheet
      open={open}
      onOpenChange={onOpenChange}
      transaction={transaction}
    />
  );
};