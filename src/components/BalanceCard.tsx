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
    <div className="p-6 mx-4 rounded-xl bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to text-white">
      <h2 className="mb-4 text-sm opacity-90">Total Balance</h2>
      <p className="mb-6 text-3xl font-bold">{formatCurrency(balance)}</p>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5" />
          <div>
            <p className="text-sm opacity-90">Income</p>
            <p className="font-semibold">{formatCurrency(income)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDownRight className="w-5 h-5" />
          <div>
            <p className="text-sm opacity-90">Expense</p>
            <p className="font-semibold">{formatCurrency(expense)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};