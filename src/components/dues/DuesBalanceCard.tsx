import { ArrowDown, ArrowUp } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";

export const DuesBalanceCard = () => {
  const { transactions } = useFinance();

  // Filter dues transactions
  const duesTransactions = transactions.filter(t => 
    t.description?.toLowerCase().includes('due given') || 
    t.description?.toLowerCase().includes('due received')
  );

  // Calculate dues totals
  const duesGiven = duesTransactions.reduce((acc, curr) => {
    return curr.description?.toLowerCase().includes('due given') 
      ? acc + Number(curr.amount) 
      : acc;
  }, 0);

  const duesReceived = duesTransactions.reduce((acc, curr) => {
    return curr.description?.toLowerCase().includes('due received') 
      ? acc + Number(curr.amount) 
      : acc;
  }, 0);

  const netDues = duesGiven - duesReceived;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-apple bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg p-6 relative overflow-hidden mb-6">
      {/* Decorative Circles */}
      <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full transform translate-x-24 -translate-y-24" />
      <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/5 rounded-full transform -translate-x-16 translate-y-16" />
      
      {/* Content */}
      <div className="relative z-10">
        <h2 className="mb-2 text-sm font-medium opacity-90">Net Dues Balance</h2>
        <p className="mb-2 text-4xl font-bold">{formatCurrency(netDues)}</p>
        <div className="h-px bg-white/20 mb-4" />
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-start gap-3">
              <div className="bg-green-400/20 p-1.5 rounded-full mt-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-green-400" />
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
              <div className="bg-red-400/20 p-1.5 rounded-full mt-0.5">
                <ArrowUp className="w-3.5 h-3.5 text-red-400" />
              </div>
              <div className="text-left">
                <p className="text-sm opacity-90">Received</p>
                <p className="text-lg font-semibold">{formatCurrency(duesReceived)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};