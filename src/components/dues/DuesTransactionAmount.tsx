import { cn } from "@/lib/utils";

type DuesTransactionAmountProps = {
  type: string;
  amount: number;
  formatCurrency: (amount: number) => string;
  className?: string;
};

export const DuesTransactionAmount = ({
  type,
  amount,
  formatCurrency,
  className
}: DuesTransactionAmountProps) => {
  return (
    <p className={cn(
      "font-semibold text-base",
      type === 'expense' ? 'text-red-600' : 'text-green-600',
      className
    )}>
      {type === 'expense' ? '-' : '+'}
      {formatCurrency(Number(amount))}
    </p>
  );
};