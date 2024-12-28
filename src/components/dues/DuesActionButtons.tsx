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
        size="icon"
        className="w-full gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
        onClick={() => onUndo(transaction)}
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="icon"
        className="text-green-600 border-green-200 hover:bg-green-50"
        onClick={() => onComplete(transaction)}
        disabled={isCompleted}
      >
        <CheckCircle2 className="w-4 h-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
        onClick={() => onPartial(transaction)}
        disabled={isCompleted}
      >
        <Percent className="w-4 h-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        className="text-blue-600 border-blue-200 hover:bg-blue-50"
        onClick={() => onReschedule(transaction)}
        disabled={isCompleted}
      >
        <Calendar className="w-4 h-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        className="text-purple-600 border-purple-200 hover:bg-purple-50"
        onClick={() => onEdit(transaction)}
        disabled={isCompleted}
      >
        <PencilIcon className="w-4 h-4" />
      </Button>
      {canDelete && (
        <Button 
          variant="outline" 
          size="icon"
          className="text-red-600 border-red-200 hover:bg-red-50"
          onClick={() => onDelete(transaction)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};