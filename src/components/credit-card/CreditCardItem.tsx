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
    <div className="space-y-4">
      <div className="relative h-auto p-6 rounded-apple overflow-hidden bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg transform transition-transform hover:scale-[1.02]">
        {/* Decorative Elements - keeping the current ones */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full transform translate-x-24 -translate-y-24" />
        <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/5 rounded-full transform -translate-x-16 translate-y-16" />
        
        <div className="relative space-y-6">
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCardIcon className="w-6 h-6" />
              <h3 className="font-medium">{card.name}</h3>
            </div>
            {card.last_four_digits && (
              <p className="text-sm">
                •••• {card.last_four_digits}
              </p>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current Outstanding */}
            <div className="p-4 bg-white/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 opacity-70" />
                <span className="text-sm opacity-70">Current Outstanding</span>
              </div>
              <p className="text-2xl font-semibold">{formatCurrency(usedCredit)}</p>
            </div>

            {/* Available Credit */}
            <div className="p-4 bg-white/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 opacity-70" />
                <span className="text-sm opacity-70">Available Credit</span>
              </div>
              <p className="text-2xl font-semibold">{formatCurrency(availableCredit)}</p>
            </div>
          </div>
          
          {/* Credit Utilization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-70">Credit Utilization</p>
              <p className="text-sm font-medium">{utilization.toFixed(0)}%</p>
            </div>
            <div className="space-y-1">
              <Progress 
                value={utilization} 
                className="h-2 bg-white/20"
              >
                <div 
                  className={`h-full ${getUtilizationColor()} transition-all duration-300`} 
                  style={{ width: `${utilization}%` }}
                />
              </Progress>
              <div className="flex justify-between text-xs opacity-70">
                <span>{formatCurrency(usedCredit)} used</span>
                <span>{formatCurrency(Number(card.credit_limit))} limit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Due Dates Section */}
      {(card.statement_date || card.due_date) && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
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
