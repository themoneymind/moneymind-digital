import { PaymentSource } from "@/types/finance";
import { formatCurrency } from "@/utils/formatters";
import { CreditCard } from "lucide-react";
import { format } from "date-fns";

interface CreditCardItemProps {
  card: PaymentSource;
}

export const CreditCardItem = ({ card }: CreditCardItemProps) => {
  const availableCredit = Number(card.credit_limit) - Math.abs(Number(card.amount));
  const utilizationRate = (Math.abs(Number(card.amount)) / Number(card.credit_limit)) * 100;

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{card.name}</h3>
            {card.last_four_digits && (
              <p className="text-sm text-muted-foreground">
                •••• {card.last_four_digits}
              </p>
            )}
          </div>
        </div>
        {card.interest_rate && (
          <span className="text-sm text-muted-foreground">
            {card.interest_rate}% APR
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="font-medium">{formatCurrency(Math.abs(Number(card.amount)))}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Available Credit</p>
          <p className="font-medium">{formatCurrency(availableCredit)}</p>
        </div>
      </div>

      {(card.statement_date || card.due_date) && (
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          {card.statement_date && (
            <div>
              <p className="text-sm text-muted-foreground">Statement Date</p>
              <p className="text-sm">{format(new Date(card.statement_date), 'MMM dd, yyyy')}</p>
            </div>
          )}
          {card.due_date && (
            <div>
              <p className="text-sm text-muted-foreground">Payment Due</p>
              <p className="text-sm">{format(new Date(card.due_date), 'MMM dd, yyyy')}</p>
            </div>
          )}
        </div>
      )}

      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${Math.min(utilizationRate, 100)}%` }}
        />
      </div>
    </div>
  );
};