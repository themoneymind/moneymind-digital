import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";

export const BalanceCard = () => {
  const { balance, income, expense } = useFinance();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 mx-4 rounded-apple bg-[#7C3AED] text-white shadow-lg">
      <h2 className="mb-2 text-xs font-medium opacity-90">Total Balance</h2>
      <p className="mb-6 text-4xl font-bold">{formatCurrency(balance)}</p>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-full">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] opacity-90">Income</p>
            <p className="text-sm font-semibold">{formatCurrency(income)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-full">
            <ArrowDownRight className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] opacity-90">Expense</p>
            <p className="text-sm font-semibold">{formatCurrency(expense)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};