import { format } from "date-fns";

interface CreditCardDatesProps {
  statementDate?: string;
  dueDate?: string;
}

export const CreditCardDates = ({ statementDate, dueDate }: CreditCardDatesProps) => {
  if (!statementDate && !dueDate) return null;

  return (
    <div className="grid grid-cols-2 gap-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
      {statementDate && (
        <div>
          <p className="text-xs text-muted-foreground">Statement Date</p>
          <p className="text-xs font-medium">{format(new Date(statementDate), 'MMM dd, yyyy')}</p>
        </div>
      )}
      {dueDate && (
        <div>
          <p className="text-xs text-muted-foreground">Payment Due</p>
          <p className="text-xs font-medium">{format(new Date(dueDate), 'MMM dd, yyyy')}</p>
        </div>
      )}
    </div>
  );
};