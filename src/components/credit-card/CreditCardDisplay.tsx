import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/lib/utils";

type CreditCardDisplayProps = {
  card: {
    id: string;
    name: string;
    amount: number;
    totalSpent: number;
    totalPayments: number;
    usedCredit: number;
    availableCredit: number;
    utilizationRate: number;
    utilizationColor: string;
  };
  isSelected: boolean;
};

export const CreditCardDisplay = ({ card, isSelected }: CreditCardDisplayProps) => {
  return (
    <div
      className={cn(
        "p-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-apple text-white shadow-lg transform transition-all duration-300",
        isSelected ? "scale-100" : "scale-95 opacity-75"
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center">
          <div className="w-6 h-4 bg-yellow-400/90 rounded-sm" />
        </div>
        <div className="flex space-x-1">
          <div className="w-8 h-8 rounded-full bg-red-500/90" />
          <div className="w-8 h-8 rounded-full bg-orange-500/90 -ml-4 mix-blend-multiply" />
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-2xl font-mono tracking-widest">
          •••• •••• •••• {card.id.slice(-4)}
        </p>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm opacity-75">Card Holder</p>
            <p className="font-medium">{card.name}</p>
          </div>
          <div>
            <p className="text-sm opacity-75">Credit Limit</p>
            <p className="font-medium">{formatCurrency(card.amount)}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Credit Used</span>
            <span>{Math.round(card.utilizationRate)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={`h-full ${card.utilizationColor}`} 
              style={{ width: `${Math.min(100, card.utilizationRate)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Used: {formatCurrency(card.usedCredit)}</span>
            <span>Available: {formatCurrency(card.availableCredit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};