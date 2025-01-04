import { PaymentSource } from "@/types/finance";
import { formatCurrency } from "@/utils/formatters";
import { CreditCard } from "lucide-react";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

interface CreditCardItemProps {
  card: PaymentSource;
}

export const CreditCardItem = ({ card }: CreditCardItemProps) => {
  const usedCredit = Number(card.amount) < 0 ? Math.abs(Number(card.amount)) : Number(card.amount);
  const availableCredit = Number(card.credit_limit) - usedCredit;
  const utilization = card.credit_limit ? (usedCredit / Number(card.credit_limit)) * 100 : 0;

  const getUtilizationColor = () => {
    if (utilization > 80) return "bg-red-500";
    if (utilization > 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-4">
      <div className="relative h-auto p-6 rounded-apple overflow-hidden bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg transform transition-transform hover:scale-[1.02]">
        {/* Decorative Circles */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full transform translate-x-24 -translate-y-24" />
        <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/5 rounded-full transform -translate-x-16 translate-y-16" />
        
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

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white/80">Current Balance</p>
                <p className="font-medium text-white">{formatCurrency(usedCredit)}</p>
              </div>
              <div>
                <p className="text-sm text-white/80">Credit Limit</p>
                <p className="font-medium text-white">{formatCurrency(Number(card.credit_limit))}</p>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-white/80">Available Credit</p>
                <p className="text-sm text-white">{formatCurrency(availableCredit)}</p>
              </div>
              <Progress 
                value={utilization} 
                className="h-2 bg-white/20"
              >
                <div 
                  className={`h-full ${getUtilizationColor()}`} 
                  style={{ width: `${utilization}%` }}
                />
              </Progress>
              <p className="text-xs text-white/80 mt-1">
                {utilization.toFixed(0)}% utilized
              </p>
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