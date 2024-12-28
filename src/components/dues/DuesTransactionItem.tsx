import { format } from "date-fns";
import { DueTransaction } from "@/types/dues";
import { DuesStatusBadge } from "./DuesStatusBadge";
import { DuesActionButtons } from "./DuesActionButtons";

type DuesTransactionItemProps = {
  transaction: DueTransaction;
  onComplete: (transaction: DueTransaction) => void;
  onPartial: (transaction: DueTransaction) => void;
  onReschedule: (transaction: DueTransaction) => void;
  onReject: (id: string) => void;
  onUndo: (transaction: DueTransaction) => void;
  formatCurrency: (amount: number) => string;
};

export const DuesTransactionItem = ({
  transaction,
  onComplete,
  onPartial,
  onReschedule,
  onReject,
  onUndo,
  formatCurrency,
}: DuesTransactionItemProps) => {
  return (
    <div className="bg-white p-4 rounded-[12px] border border-gray-200 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{transaction.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{format(new Date(transaction.date), 'PPP')}</span>
            {transaction.repayment_date && (
              <>
                <span>•</span>
                <span>Due: {format(new Date(transaction.repayment_date), 'PPP')}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${
            transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
          }`}>
            {transaction.type === 'expense' ? '-' : '+'}
            {formatCurrency(Number(transaction.amount))}
          </p>
          <DuesStatusBadge transaction={transaction} />
        </div>
      </div>
      
      {transaction.excuse_reason && (
        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
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
        onReject={onReject}
        onUndo={onUndo}
      />
    </div>
  );
};