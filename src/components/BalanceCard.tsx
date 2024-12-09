import { ArrowDown, ArrowUp } from "lucide-react";
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
    <div className="p-6 mx-4 rounded-apple bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg">
      <h2 className="mb-2 text-base font-medium opacity-90">Total Balance</h2>
      <p className="mb-8 text-4xl font-bold">{formatCurrency(balance)}</p>
      <div className="h-px bg-white/20 mb-6" />
      <div className="flex justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="bg-green-400/20 p-2 rounded-full">
            <ArrowDown className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-base opacity-90">Income</p>
            <p className="text-2xl font-semibold">{formatCurrency(income)}</p>
          </div>
        </div>
        <div className="w-px h-14 bg-white/20" />
        <div className="flex items-center gap-4">
          <div className="bg-red-400/20 p-2 rounded-full">
            <ArrowUp className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-base opacity-90">Expense</p>
            <p className="text-2xl font-semibold">{formatCurrency(expense)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};