import { DueTransaction } from "@/types/dues";
import { DuesTransactionItem } from "./DuesTransactionItem";
import { formatDuesCurrency } from "@/utils/duesUtils";

interface DuesTransactionListProps {
  transactions: DueTransaction[];
  onComplete: (transaction: DueTransaction) => void;
  onPartial: (transaction: DueTransaction) => void;
  onReschedule: (transaction: DueTransaction) => void;
  onEdit: (transaction: DueTransaction) => void;
  onUndo: (transaction: DueTransaction) => void;
  onDelete: (transaction: DueTransaction) => void;
}

export const DuesTransactionList = ({
  transactions,
  onComplete,
  onPartial,
  onReschedule,
  onEdit,
  onUndo,
  onDelete,
}: DuesTransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No due transactions yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <DuesTransactionItem
          key={transaction.id}
          transaction={transaction}
          onComplete={onComplete}
          onPartial={onPartial}
          onReschedule={onReschedule}
          onEdit={onEdit}
          onUndo={onUndo}
          onDelete={onDelete}
          formatCurrency={formatDuesCurrency}
        />
      ))}
    </div>
  );
};