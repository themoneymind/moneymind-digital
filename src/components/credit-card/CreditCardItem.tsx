import { PaymentSource } from "@/types/finance";
import { formatCurrency } from "@/utils/formatters";
import { CreditCard, Clock, CreditCard as CreditCardIcon } from "lucide-react";
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
    <div className="space-y-3">
      <div className="relative p-6 rounded-apple overflow-hidden bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg transform transition-transform hover:scale-[1.02]">
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full transform translate-x-24 -translate-y-24" />
        <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/5 rounded-full transform -translate-x-16 translate-y-16" />
        
        <div className="relative space-y-4">
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CreditCardIcon className="w-4 h-4" />
              <h3 className="text-sm font-medium">{card.name}</h3>
            </div>
            {card.last_four_digits && (
              <p className="text-xs">
                •••• {card.last_four_digits}
              </p>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-2 gap-3">
            {/* Outstanding */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 opacity-70" />
                <span className="text-xs opacity-70">Outstanding</span>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(usedCredit)}</p>
            </div>

            {/* Available Credit */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <CreditCard className="w-3.5 h-3.5 opacity-70" />
                <span className="text-xs opacity-70">Available Credit</span>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(availableCredit)}</p>
            </div>
          </div>

          {/* Credit Utilization */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs opacity-70">Credit Utilization</p>
              <p className="text-xs font-medium">{utilization.toFixed(0)}%</p>
            </div>
            <div className="space-y-1">
              <Progress 
                value={utilization} 
                className="h-1.5 bg-white/20"
              >
                <div 
                  className={`h-full ${getUtilizationColor()} transition-all duration-300`} 
                  style={{ width: `${utilization}%` }}
                />
              </Progress>
              <div className="flex justify-between text-[10px] opacity-70">
                <span>{formatCurrency(usedCredit)} used</span>
                <span>{formatCurrency(Number(card.credit_limit))} limit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Due Dates Section */}
      {(card.statement_date || card.due_date) && (
        <div className="grid grid-cols-2 gap-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
          {card.statement_date && (
            <div>
              <p className="text-xs text-muted-foreground">Statement Date</p>
              <p className="text-xs font-medium">{format(new Date(card.statement_date), 'MMM dd, yyyy')}</p>
            </div>
          )}
          {card.due_date && (
            <div>
              <p className="text-xs text-muted-foreground">Payment Due</p>
              <p className="text-xs font-medium">{format(new Date(card.due_date), 'MMM dd, yyyy')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};