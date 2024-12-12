import { ArrowDown, ArrowUp } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { startOfMonth, endOfMonth, isWithinInterval, subMonths, endOfDay, isFuture, isAfter, isBefore } from "date-fns";

export const BalanceCard = () => {
  const { transactions, currentMonth, paymentSources } = useFinance();

  // Get the earliest transaction date to determine when the user started using the app
  const earliestTransaction = transactions.length > 0 
    ? new Date(Math.min(...transactions.map(t => new Date(t.date).getTime())))
    : new Date();

  // Check if current selected month is in the future
  const isCurrentMonthFuture = isAfter(startOfMonth(currentMonth), startOfMonth(new Date()));

  // Check if current selected month is before the user started using the app
  const isBeforeFirstTransaction = isBefore(startOfMonth(currentMonth), startOfMonth(earliestTransaction));

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

  // Filter transactions for the last month
  const lastMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const lastMonthStart = startOfMonth(subMonths(currentMonth, 1));
    const lastMonthEnd = endOfDay(endOfMonth(subMonths(currentMonth, 1)));
    
    return isWithinInterval(transactionDate, {
      start: lastMonthStart,
      end: lastMonthEnd
    });
  });

  // Calculate monthly expense (0 for future months or months before first transaction)
  const monthlyExpense = (isCurrentMonthFuture || isBeforeFirstTransaction) ? 0 : monthlyTransactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + Number(curr.amount) : acc;
  }, 0);

  // Calculate total income from payment sources (0 for future months or months before first transaction)
  const totalIncome = (isCurrentMonthFuture || isBeforeFirstTransaction) ? 0 : paymentSources.reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Calculate last month's balance
  const lastMonthIncome = lastMonthTransactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc;
  }, 0);

  const lastMonthExpense = lastMonthTransactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + Number(curr.amount) : acc;
  }, 0);

  const lastMonthBalance = lastMonthIncome - lastMonthExpense;

  // For future months, total balance is just the last month's balance
  // For months before first transaction, total balance is 0
  // For current or past months within app usage, calculate normally
  const totalBalance = isBeforeFirstTransaction 
    ? 0 
    : isCurrentMonthFuture 
      ? lastMonthBalance 
      : totalIncome - monthlyExpense;

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
      <p className="mb-2 text-4xl font-bold">{formatCurrency(totalBalance)}</p>
      <p className="text-xs opacity-75 mb-4">Last month's balance: {formatCurrency(lastMonthBalance)}</p>
      <div className="h-px bg-white/20 mb-4" />
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-400/20 p-1.5 rounded-full">
            <ArrowDown className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-sm opacity-90">Income</p>
            <p className="text-lg font-semibold">{formatCurrency(totalIncome)}</p>
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