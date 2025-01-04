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
      return "text-sm";
    }
    if (amountStr.length >= 7) {
      return "text-base";
    }
    return "text-lg";
  };

  return (
    <div className="grid grid-cols-2 gap-3 relative">
      <div className="flex flex-col items-start">
        <span className="text-[10px] opacity-70 mb-1">Outstanding</span>
        <p className={`${getTextSize(usedCredit)} font-bold`}>{formatCurrency(usedCredit)}</p>
      </div>

      <div className="flex flex-col items-start">
        <span className="text-[10px] opacity-70 mb-1">Available Credit</span>
        <p className={`${getTextSize(availableCredit)} font-bold`}>{formatCurrency(availableCredit)}</p>
      </div>
    </div>
  );
};