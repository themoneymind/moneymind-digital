import { useFinance } from "@/contexts/FinanceContext";
import { DueTransaction } from "@/types/dues";
import { DuesTransactionItem } from "./DuesTransactionItem";
import { useDuesListOperations } from "./hooks/useDuesListOperations";
import { formatDuesCurrency } from "@/utils/duesUtils";
import { DuesDialogManager } from "./DuesDialogManager";

export const DuesTransactionsList = () => {
  const { transactions } = useFinance();
  const {
    selectedTransaction,
    dialogStates,
    handlers,
  } = useDuesListOperations();

  // Filter only active due transactions (not rejected)
  const dueTransactions = transactions.filter(
    transaction => transaction.reference_type === 'due'
  ) as DueTransaction[];

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-base font-semibold">Due Transactions</h3>
      <div className="space-y-3">
        {dueTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No due transactions yet
          </div>
        ) : (
          dueTransactions.map((transaction) => (
            <DuesTransactionItem
              key={transaction.id}
              transaction={transaction}
              onComplete={handlers.handleComplete}
              onPartial={handlers.handlePartial}
              onReschedule={handlers.handleReschedule}
              onEdit={handlers.handleEdit}
              onUndo={handlers.handleUndo}
              onDelete={handlers.handleDelete}
              formatCurrency={formatDuesCurrency}
            />
          ))
        )}
      </div>

      {selectedTransaction && (
        <DuesDialogManager
          selectedTransaction={selectedTransaction}
          dialogStates={dialogStates}
          handlers={handlers}
        />
      )}
    </div>
  );
};