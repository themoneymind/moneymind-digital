import { ArrowDown, ArrowUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type MonthlyStatsProps = {
  monthlyIncome: number;
  monthlyExpense: number;
};

export const MonthlyStats = ({ monthlyIncome, monthlyExpense }: MonthlyStatsProps) => {
  return (
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
  );
};