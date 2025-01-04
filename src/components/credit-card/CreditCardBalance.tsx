import { formatCurrency } from "@/utils/formatters";
import { Separator } from "@/components/ui/separator";

interface CreditCardBalanceProps {
  usedCredit: number;
  availableCredit: number;
}

export const CreditCardBalance = ({ usedCredit, availableCredit }: CreditCardBalanceProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 relative">
      <div className="flex flex-col items-start">
        <span className="text-xs opacity-70 mb-1">Outstanding</span>
        <p className="text-3xl font-bold">{formatCurrency(usedCredit)}</p>
      </div>

      <Separator orientation="vertical" className="absolute left-1/2 h-full -translate-x-1/2 bg-white/20" />

      <div className="flex flex-col items-start">
        <span className="text-xs opacity-70 mb-1">Available Credit</span>
        <p className="text-3xl font-bold">{formatCurrency(availableCredit)}</p>
      </div>
    </div>
  );
};