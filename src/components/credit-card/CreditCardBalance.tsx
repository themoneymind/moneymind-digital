import { formatCurrency } from "@/utils/formatters";
import { Separator } from "@/components/ui/separator";

interface CreditCardBalanceProps {
  usedCredit: number;
  availableCredit: number;
}

export const CreditCardBalance = ({ usedCredit, availableCredit }: CreditCardBalanceProps) => {
  // Helper function to determine text size based on number length
  const getTextSize = (amount: number) => {
    const amountStr = Math.floor(amount).toString();
    if (amountStr.length >= 8) {
      return "text-xl";
    }
    if (amountStr.length >= 7) {
      return "text-2xl";
    }
    return "text-3xl";
  };

  return (
    <div className="grid grid-cols-2 gap-3 relative">
      <div className="flex flex-col items-start">
        <span className="text-xs opacity-70 mb-1">Outstanding</span>
        <p className={`${getTextSize(usedCredit)} font-bold`}>{formatCurrency(usedCredit)}</p>
      </div>

      <Separator orientation="vertical" className="absolute left-1/2 h-full -translate-x-1/2 bg-white/20" />

      <div className="flex flex-col items-start">
        <span className="text-xs opacity-70 mb-1">Available Credit</span>
        <p className={`${getTextSize(availableCredit)} font-bold`}>{formatCurrency(availableCredit)}</p>
      </div>
    </div>
  );
};