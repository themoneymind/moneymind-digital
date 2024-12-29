import { format } from "date-fns";
import { DueTransaction } from "@/types/dues";
import { DuesStatusBadge } from "./DuesStatusBadge";
import { DuesActionButtons } from "./DuesActionButtons";

type DuesTransactionItemProps = {
  transaction: DueTransaction;
  onComplete: (transaction: DueTransaction) => void;
  onPartial: (transaction: DueTransaction) => void;
  onReschedule: (transaction: DueTransaction) => void;
  onEdit: (transaction: DueTransaction) => void;
  onUndo: (transaction: DueTransaction) => void;
  onDelete: (transaction: DueTransaction) => void;
  formatCurrency: (amount: number) => string;
};

export const DuesTransactionItem = ({
  transaction,
  onComplete,
  onPartial,
  onReschedule,
  onEdit,
  onUndo,
  onDelete,
  formatCurrency,
}: DuesTransactionItemProps) => {
  const personName = transaction.description?.replace(/^Due (Given to|Received from): /, '') || '';
  const isExpense = transaction.type === 'expense';
  const prefix = isExpense ? 'Given to' : 'Received from';

  return (
    <div className="bg-white rounded-[12px] border border-gray-200 overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-gray-900 font-medium">
              {`${prefix}: ${personName}`}
            </h3>
            <div className="space-y-0.5">
              <div className="text-gray-500 text-sm">
                Given Date: {format(new Date(transaction.date), 'do MMMM, yyyy')}
              </div>
              {transaction.repayment_date && (
                <div className="text-gray-500 text-sm">
                  Due Date: <span className="text-blue-500">
                    {format(new Date(transaction.repayment_date), 'do MMMM, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right space-y-2">
            <p className={`text-xl font-semibold ${
              isExpense ? 'text-red-600' : 'text-green-600'
            }`}>
              {isExpense ? '-' : '+'}
              {formatCurrency(Number(transaction.remaining_balance || transaction.amount))}
            </p>
            <DuesStatusBadge transaction={transaction} />
          </div>
        </div>

        {transaction.excuse_reason && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
            Reason: {transaction.excuse_reason}
          </div>
        )}

        <div className="h-[1px] bg-gray-200 my-3" />

        <DuesActionButtons
          transaction={transaction}
          onComplete={onComplete}
          onPartial={onPartial}
          onReschedule={onReschedule}
          onEdit={onEdit}
          onUndo={onUndo}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};