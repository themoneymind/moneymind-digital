import { ArrowDown, ArrowUp } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

interface BalanceInfoProps {
  displayBalance: number;
  lastMonthClosingBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

export const BalanceInfo = ({
  displayBalance,
  lastMonthClosingBalance,
  monthlyIncome,
  monthlyExpense,
}: BalanceInfoProps) => {
  return (
    <>
      <h2 className="mb-2 text-sm font-medium opacity-90">Total Balance</h2>
      <p className="mb-2 text-4xl font-bold">{formatCurrency(displayBalance)}</p>
      <p className="mb-2 text-xs opacity-75">
        Last month's closing balance: {formatCurrency(lastMonthClosingBalance)}
      </p>
      <div className="h-px bg-white/20 mb-4" />
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-400/20 p-1.5 rounded-full">
            <ArrowDown className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-sm opacity-90">Income</p>
            <p className="text-lg font-semibold">{formatCurrency(monthlyIncome)}</p>
          </div>
        </div>
        <div className="w-px h-12 bg-white/20" />
        <div className="flex items-center gap-3 mr-2">
          <div className="bg-red-400/20 p-1.5 rounded-full">
            <ArrowUp className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <p className="text-sm opacity-90">Expense</p>
            <p className="text-lg font-semibold">{formatCurrency(monthlyExpense)}</p>
          </div>
        </div>
      </div>
    </>
  );
};