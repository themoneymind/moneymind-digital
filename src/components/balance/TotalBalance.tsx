import { formatCurrency } from "@/lib/utils";

type TotalBalanceProps = {
  totalBalance: number;
  previousBalance: number;
};

export const TotalBalance = ({ totalBalance, previousBalance }: TotalBalanceProps) => {
  return (
    <div>
      <h2 className="mb-2 text-sm font-medium opacity-90">Total Balance</h2>
      <p className="mb-2 text-4xl font-bold">{formatCurrency(totalBalance)}</p>
      <p className="text-xs opacity-75 mb-4">Last month's balance: {formatCurrency(previousBalance)}</p>
      <div className="h-px bg-white/20 mb-4" />
    </div>
  );
};