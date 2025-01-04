import { CreditCard as CreditCardIcon } from "lucide-react";

interface CreditCardHeaderProps {
  name: string;
  lastFourDigits?: string;
}

export const CreditCardHeader = ({ name, lastFourDigits }: CreditCardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <CreditCardIcon className="w-4 h-4" />
        <h3 className="text-sm font-medium">{name}</h3>
      </div>
      {lastFourDigits && (
        <p className="text-xs">
          •••• {lastFourDigits}
        </p>
      )}
    </div>
  );
};