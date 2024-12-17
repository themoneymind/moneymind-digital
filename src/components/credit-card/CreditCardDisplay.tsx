import { CreditCard, ArrowUp, ArrowDown } from "lucide-react";
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
      className="p-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-apple text-white shadow-lg transform transition-transform duration-300"
      style={{
        transform: `scale(${isSelected ? 1 : 0.9})`,
      }}
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
          5000 0000 0000 0000
        </p>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm opacity-75">Card Holder</p>
            <p className="font-medium">{card.name}</p>
          </div>
          <div>
            <p className="text-sm opacity-75">Expires</p>
            <p className="font-medium">12/25</p>
          </div>
        </div>
      </div>
    </div>
  );
};