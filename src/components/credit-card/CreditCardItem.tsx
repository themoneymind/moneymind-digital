import { PaymentSource } from "@/types/finance";
import { formatCurrency } from "@/utils/formatters";
import { CreditCard } from "lucide-react";
import { format } from "date-fns";

interface CreditCardItemProps {
  card: PaymentSource;
}

export const CreditCardItem = ({ card }: CreditCardItemProps) => {
  const availableCredit = Number(card.credit_limit) - Math.abs(Number(card.amount));

  return (
    <div className="space-y-4">
      <div className="relative h-48 p-6 rounded-[20px] overflow-hidden bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to shadow-lg transform transition-transform hover:scale-[1.02]">
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="relative space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">{card.name}</h3>
                {card.last_four_digits && (
                  <p className="text-sm text-white/80">
                    •••• {card.last_four_digits}
                  </p>
                )}
              </div>
            </div>
            {card.interest_rate && (
              <span className="text-sm text-white/80">
                {card.interest_rate}% APR
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/80">Current Balance</p>
              <p className="font-medium text-white">{formatCurrency(Math.abs(Number(card.amount)))}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Available Credit</p>
              <p className="font-medium text-white">{formatCurrency(availableCredit)}</p>
            </div>
          </div>
        </div>
      </div>

      {(card.statement_date || card.due_date) && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-xl border border-gray-100">
          {card.statement_date && (
            <div>
              <p className="text-sm text-muted-foreground">Statement Date</p>
              <p className="text-sm font-medium">{format(new Date(card.statement_date), 'MMM dd, yyyy')}</p>
            </div>
          )}
          {card.due_date && (
            <div>
              <p className="text-sm text-muted-foreground">Payment Due</p>
              <p className="text-sm font-medium">{format(new Date(card.due_date), 'MMM dd, yyyy')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};