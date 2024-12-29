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
    <div className="flex justify-between gap-2">
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1 gap-2 p-0 h-10"
        onClick={() => onComplete(transaction)}
        disabled={isCompleted}
      >
        <CheckCircle2 className="w-5 h-5 text-green-600" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1 gap-2 p-0 h-10"
        onClick={() => onPartial(transaction)}
        disabled={isCompleted}
      >
        <Percent className="w-5 h-5 text-yellow-600" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1 gap-2 p-0 h-10"
        onClick={() => onReschedule(transaction)}
        disabled={isCompleted}
      >
        <Calendar className="w-5 h-5 text-blue-600" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1 gap-2 p-0 h-10"
        onClick={() => onEdit(transaction)}
        disabled={isCompleted}
      >
        <PencilIcon className="w-5 h-5 text-purple-600" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1 gap-2 p-0 h-10 hover:bg-red-50"
        onClick={() => onDelete(transaction)}
      >
        <Trash2 className="w-5 h-5 text-red-600" />
      </Button>
    </div>
  );
};