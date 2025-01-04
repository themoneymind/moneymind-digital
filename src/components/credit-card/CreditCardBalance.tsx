import { Clock, CreditCard } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Separator } from "@/components/ui/separator";

interface CreditCardBalanceProps {
  usedCredit: number;
  availableCredit: number;
}

export const CreditCardBalance = ({ usedCredit, availableCredit }: CreditCardBalanceProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 relative">
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <Clock className="w-3.5 h-3.5 opacity-70" />
          <span className="text-xs opacity-70">Outstanding</span>
        </div>
        <p className="text-3xl font-bold">{formatCurrency(usedCredit)}</p>
      </div>

      <Separator orientation="vertical" className="absolute left-1/2 h-full -translate-x-1/2 bg-white/20" />

      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <CreditCard className="w-3.5 h-3.5 opacity-70" />
          <span className="text-xs opacity-70">Available Credit</span>
        </div>
        <p className="text-3xl font-bold">{formatCurrency(availableCredit)}</p>
      </div>
    </div>
  );
};