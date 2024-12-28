import { format } from "date-fns";
import { DueTransaction } from "@/types/dues";
import { DuesStatusBadge } from "./DuesStatusBadge";
import { DuesActionButtons } from "./DuesActionButtons";
import { DuesTransactionAmount } from "./DuesTransactionAmount";
import { Calendar, Clock } from "lucide-react";

type DuesTransactionItemProps = {
  transaction: DueTransaction;
  onComplete: (transaction: DueTransaction) => void;
  onPartial: (transaction: DueTransaction) => void;
  onReschedule: (transaction: DueTransaction) => void;
  onReject: (id: string) => void;
  onUndo: (transaction: DueTransaction) => void;
  onDelete: (transaction: DueTransaction) => void;
  formatCurrency: (amount: number) => string;
};

export const DuesTransactionItem = ({
  transaction,
  onComplete,
  onPartial,
  onReschedule,
  onReject,
  onUndo,
  onDelete,
  formatCurrency,
}: DuesTransactionItemProps) => {
  const isCompleted = transaction.status === 'completed';
  const isRejected = transaction.status === 'rejected';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {transaction.description}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(transaction.date), 'PPP')}</span>
              </div>
              {transaction.repayment_date && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Due: {format(new Date(transaction.repayment_date), 'PPP')}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right space-y-1">
            <DuesTransactionAmount
              type={transaction.type}
              amount={transaction.amount}
              formatCurrency={formatCurrency}
            />
            <DuesStatusBadge transaction={transaction} />
          </div>
        </div>

        {/* Reason (if exists) */}
        {transaction.excuse_reason && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
            <span className="font-medium">Reason:</span> {transaction.excuse_reason}
          </div>
        )}

        {/* Audit Trail */}
        {transaction.audit_trail && transaction.audit_trail.length > 0 && (
          <div className="text-sm text-gray-500 italic border-t pt-2">
            Last action: {transaction.audit_trail[transaction.audit_trail.length - 1]?.action}
          </div>
        )}

        {/* Action Buttons */}
        <div className={cn(
          "pt-2",
          (transaction.audit_trail?.length ?? 0) > 0 ? "border-t" : ""
        )}>
          <DuesActionButtons
            transaction={transaction}
            onComplete={onComplete}
            onPartial={onPartial}
            onReschedule={onReschedule}
            onReject={onReject}
            onUndo={onUndo}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
};