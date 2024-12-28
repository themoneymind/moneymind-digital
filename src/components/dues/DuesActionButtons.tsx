import { Button } from "@/components/ui/button";
import { CheckCircle2, Percent, Calendar, RotateCcw, Trash2, PencilIcon } from "lucide-react";
import { DueTransaction } from "@/types/dues";

type DuesActionButtonsProps = {
  transaction: DueTransaction;
  onComplete: (transaction: DueTransaction) => void;
  onPartial: (transaction: DueTransaction) => void;
  onReschedule: (transaction: DueTransaction) => void;
  onEdit: (transaction: DueTransaction) => void;
  onUndo: (transaction: DueTransaction) => void;
  onDelete: (transaction: DueTransaction) => void;
};

export const DuesActionButtons = ({
  transaction,
  onComplete,
  onPartial,
  onReschedule,
  onEdit,
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
        className="w-full gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
        onClick={() => onUndo(transaction)}
      >
        <RotateCcw className="w-4 h-4" />
        Undo Complete
      </Button>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1 gap-2 text-green-600 border-green-200 hover:bg-green-50 min-w-[100px]"
        onClick={() => onComplete(transaction)}
        disabled={isCompleted}
      >
        <CheckCircle2 className="w-4 h-4" />
        Complete
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1 gap-2 text-yellow-600 border-yellow-200 hover:bg-yellow-50 min-w-[100px]"
        onClick={() => onPartial(transaction)}
        disabled={isCompleted}
      >
        <Percent className="w-4 h-4" />
        Partial
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1 gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 min-w-[100px]"
        onClick={() => onReschedule(transaction)}
        disabled={isCompleted}
      >
        <Calendar className="w-4 h-4" />
        Reschedule
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1 gap-2 text-purple-600 border-purple-200 hover:bg-purple-50 min-w-[100px]"
        onClick={() => onEdit(transaction)}
        disabled={isCompleted}
      >
        <PencilIcon className="w-4 h-4" />
        Edit
      </Button>
      {canDelete && (
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 gap-2 text-red-600 border-red-200 hover:bg-red-50 min-w-[100px]"
          onClick={() => onDelete(transaction)}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      )}
    </div>
  );
};