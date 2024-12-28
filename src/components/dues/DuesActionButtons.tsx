import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Percent, Calendar } from "lucide-react";
import { DueTransaction } from "@/types/dues";

type DuesActionButtonsProps = {
  transaction: DueTransaction;
  onComplete: (id: string) => void;
  onPartial: (transaction: DueTransaction) => void;
  onReschedule: (transaction: DueTransaction) => void;
  onReject: (id: string) => void;
};

export const DuesActionButtons = ({
  transaction,
  onComplete,
  onPartial,
  onReschedule,
  onReject,
}: DuesActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1 gap-2"
        onClick={() => onComplete(transaction.id)}
        disabled={transaction.status === 'completed'}
      >
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        Complete
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1 gap-2"
        onClick={() => onPartial(transaction)}
        disabled={transaction.status === 'completed'}
      >
        <Percent className="w-4 h-4 text-yellow-600" />
        Partial
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="flex-1 gap-2"
        onClick={() => onReschedule(transaction)}
        disabled={transaction.status === 'completed'}
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
  );
};