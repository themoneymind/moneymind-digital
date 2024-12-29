import { format } from "date-fns";
import { DueTransaction } from "@/types/dues";
import { DuesStatusBadge } from "./DuesStatusBadge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, CircleDollarSign } from "lucide-react";

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
  onEdit,
  onDelete,
  formatCurrency,
}: DuesTransactionItemProps) => {
  const description = transaction.description?.replace(/^Due (Given to|Received from): /, '') || '';
  const isCompleted = transaction.status === 'completed';
  const canDelete = !transaction.status || transaction.status === 'pending';

  const handlePayClick = () => {
    // This will now open a dialog asking if it's full or partial payment
    if (transaction.remaining_balance === transaction.amount) {
      onComplete(transaction);
    } else {
      onPartial(transaction);
    }
  };

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start mb-3">
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
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl mt-3">
            Reason: {transaction.excuse_reason}
          </p>
        )}
      </div>
      
      <div className="px-5 py-3 flex justify-end gap-2">
        {!isCompleted && (
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50"
            onClick={handlePayClick}
          >
            <CircleDollarSign className="w-4 h-4 mr-2" />
            Pay
          </Button>
        )}
        {!isCompleted && (
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={() => onEdit(transaction)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
        {canDelete && (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => onDelete(transaction)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};