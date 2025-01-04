import { formatCurrency } from "@/utils/formatters";

interface CreditCardBalanceProps {
  usedCredit: number;
  availableCredit: number;
}

export const CreditCardBalance = ({ usedCredit, availableCredit }: CreditCardBalanceProps) => {
  // Helper function to determine text size based on number length
  const getTextSize = (amount: number) => {
    const amountStr = Math.floor(amount).toString();
    if (amountStr.length >= 8) {
      return "text-lg";
    }
    if (amountStr.length >= 7) {
      return "text-xl";
    }
    return "text-2xl";
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <span className="text-xs opacity-70 mb-1">Outstanding</span>
      <p className={`${getTextSize(usedCredit)} font-bold`}>{formatCurrency(usedCredit)}</p>

      <span className="text-xs opacity-70 mb-1">Available Credit</span>
      <p className={`${getTextSize(availableCredit)} font-bold`}>{formatCurrency(availableCredit)}</p>
    </div>
  );
};