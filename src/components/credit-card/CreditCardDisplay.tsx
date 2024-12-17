import { CreditCard } from "lucide-react";
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
      className="p-6 bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to rounded-apple text-white shadow-lg transform transition-transform duration-300"
      style={{
        transform: `scale(${isSelected ? 1 : 0.9})`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-medium opacity-90">{card.name}</p>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm opacity-75">Credit Limit</p>
          <p className="text-2xl font-bold">{formatCurrency(card.amount)}</p>
        </div>

        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all", card.utilizationColor)}
            style={{ width: `${Math.min(card.utilizationRate, 100)}%`, opacity: 0.8 }}
          />
        </div>

        <div className="flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-red-400/20 rounded-full">
                <ArrowUp className="w-3 h-3 text-red-400" />
              </div>
              <p className="text-sm opacity-75">Used</p>
            </div>
            <p className="text-lg font-semibold mt-1">
              {formatCurrency(card.usedCredit)}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-green-400/20 rounded-full">
                <ArrowDown className="w-3 h-3 text-green-400" />
              </div>
              <p className="text-sm opacity-75">Available</p>
            </div>
            <p className="text-lg font-semibold mt-1">
              {formatCurrency(card.availableCredit)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};