import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export const BalanceCard = () => {
  return (
    <div className="p-6 mx-4 rounded-xl bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to text-white">
      <h2 className="mb-4 text-sm opacity-90">Total Balance</h2>
      <p className="mb-6 text-3xl font-bold">₹2,20,150</p>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5" />
          <div>
            <p className="text-sm opacity-90">Income</p>
            <p className="font-semibold">₹3,82,150</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDownRight className="w-5 h-5" />
          <div>
            <p className="text-sm opacity-90">Expense</p>
            <p className="font-semibold">₹1,62,000</p>
          </div>
        </div>
      </div>
    </div>
  );
};