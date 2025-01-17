import { ArrowDown, ArrowUp } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { DueTransaction } from "@/types/dues";

export const DuesBalanceCard = () => {
  const { transactions } = useFinance();

  // Filter dues transactions and exclude rejected ones
  const duesTransactions = transactions.filter(t => 
    t.reference_type === 'due' && t.status !== 'rejected'
  ) as DueTransaction[];

  // Calculate dues totals
  const duesGiven = duesTransactions.reduce((acc, curr) => {
    return curr.type === 'expense'
      ? acc + Number(curr.remaining_balance || curr.amount)
      : acc;
  }, 0);

  const duesReceived = duesTransactions.reduce((acc, curr) => {
    return curr.type === 'income'
      ? acc + Number(curr.remaining_balance || curr.amount)
      : acc;
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-apple bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg p-4 relative overflow-hidden mb-4">
      <h3 className="text-lg font-semibold mb-3">Dues Overview</h3>
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-start gap-3">
            <div className="bg-red-400/20 p-1.5 rounded-full mt-0.5">
              <ArrowDown className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="text-left">
              <p className="text-sm opacity-90">Given</p>
              <p className="text-lg font-semibold">{formatCurrency(duesGiven)}</p>
            </div>
          </div>
        </div>
        <div className="w-px h-12 bg-white/20" />
        <div className="flex items-center gap-3">
          <div className="flex items-start gap-3">
            <div className="bg-green-400/20 p-1.5 rounded-full mt-0.5">
              <ArrowUp className="w-3.5 h-3.5 text-green-400" />
            </div>
            <div className="text-left">
              <p className="text-sm opacity-90">Received</p>
              <p className="text-lg font-semibold">{formatCurrency(duesReceived)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};