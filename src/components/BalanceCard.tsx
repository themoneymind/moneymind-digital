import { ArrowDown, ArrowUp } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export const BalanceCard = () => {
  const { transactions, currentMonth, paymentSources } = useFinance();

  // Filter transactions for the current month
  const monthlyTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    return isWithinInterval(transactionDate, {
      start: monthStart,
      end: monthEnd
    });
  });

  // Calculate monthly income (including payment source changes) and expense
  const monthlyIncome = monthlyTransactions.reduce((acc, curr) => {
    if (curr.type === "income") {
      return acc + Number(curr.amount);
    }
    return acc;
  }, 0);

  const monthlyExpense = monthlyTransactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + Number(curr.amount) : acc;
  }, 0);

  // Calculate total balance from payment sources
  const totalBalance = paymentSources.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 mx-4 rounded-apple bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg">
      <h2 className="mb-2 text-sm font-medium opacity-90">Total Balance</h2>
      <p className="mb-6 text-4xl font-bold">{formatCurrency(totalBalance)}</p>
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
    </div>
  );
};