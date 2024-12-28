import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Percent, Calendar, RotateCcw, Trash2 } from "lucide-react";
import { DueTransaction } from "@/types/dues";

type DuesActionButtonsProps = {
  transaction: DueTransaction;
  onComplete: (transaction: DueTransaction) => void;
  onPartial: (transaction: DueTransaction) => void;
  onReschedule: (transaction: DueTransaction) => void;
  onReject: (id: string) => void;
  onUndo: (transaction: DueTransaction) => void;
  onDelete: (transaction: DueTransaction) => void;
};

export const DuesActionButtons = ({
  transaction,
  onComplete,
  onPartial,
  onReschedule,
  onReject,
  onUndo,
  onDelete,
}: DuesActionButtonsProps) => {
  const isCompleted = transaction.status === 'completed';
  const showUndo = isCompleted && transaction.previous_status;
  const canDelete = !transaction.status || transaction.status === 'pending';

  if (showUndo) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        className="w-full gap-2"
        onClick={() => onUndo(transaction)}
      >
        <RotateCcw className="w-4 h-4 text-blue-600" />
        Undo Complete
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 gap-2"
          onClick={() => onComplete(transaction)}
          disabled={isCompleted}
        >
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          Complete
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 gap-2"
          onClick={() => onPartial(transaction)}
          disabled={isCompleted}
        >
          <Percent className="w-4 h-4 text-yellow-600" />
          Partial
        </Button>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 gap-2"
          onClick={() => onReschedule(transaction)}
          disabled={isCompleted}
        >
          <Calendar className="w-4 h-4 text-blue-600" />
          Reschedule
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 gap-2"
          onClick={() => onReject(transaction.id)}
          disabled={transaction.status === 'rejected'}
        >
          <XCircle className="w-4 h-4 text-red-600" />
          Reject
        </Button>
      </div>
      {canDelete && (
        <Button 
          variant="outline" 
          size="sm"
          className="w-full gap-2 border-red-200 hover:bg-red-50"
          onClick={() => onDelete(transaction)}
        >
          <Trash2 className="w-4 h-4 text-red-600" />
          Delete
        </Button>
      )}
    </div>
  );
};