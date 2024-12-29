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
  const description = transaction.description?.replace(/^Due (Given to|Received from): /, '') || '';

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg">
            <span className="text-gray-500 font-normal">
              {transaction.type === 'expense' ? 'Due Given to: ' : 'Due Received from: '}
            </span>
            <span className="text-gray-900 font-medium">{description}</span>
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Given: {format(new Date(transaction.date), 'PP')}</span>
            {transaction.repayment_date && (
              <>
                <span>•</span>
                <span>Due: {format(new Date(transaction.repayment_date), 'PP')}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right space-y-2">
          <p className={`text-xl font-semibold ${
            transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
          }`}>
            {transaction.type === 'expense' ? '-' : '+'}
            {formatCurrency(Number(transaction.amount))}
          </p>
          <DuesStatusBadge transaction={transaction} />
        </div>
      </div>
      
      {transaction.excuse_reason && (
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
          Reason: {transaction.excuse_reason}
        </p>
      )}

      {transaction.audit_trail && transaction.audit_trail.length > 0 && (
        <div className="text-sm text-gray-500 italic">
          Last action: {transaction.audit_trail[transaction.audit_trail.length - 1]?.action}
        </div>
      )}

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
  );
};