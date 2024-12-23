import { ArrowDown, ArrowUp } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval, 
  subMonths, 
  isFuture, 
  isAfter, 
  isBefore, 
  isEqual 
} from "date-fns";

export const BalanceCard = () => {
  const { transactions, currentMonth, paymentSources } = useFinance();

  // Get the earliest transaction date to determine when the user started using the app
  const earliestTransaction = transactions.length > 0 
    ? new Date(Math.min(...transactions.map(t => new Date(t.date).getTime())))
    : new Date();

  // Check if current selected month is in the future or present
  const isCurrentMonthFuture = isAfter(startOfMonth(currentMonth), startOfMonth(new Date()));
  const isCurrentMonth = isEqual(startOfMonth(currentMonth), startOfMonth(new Date()));

  // Calculate current total balance from payment sources
  const currentTotalBalance = paymentSources.reduce((acc, curr) => acc + Number(curr.amount), 0);

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

  // Get last month's transactions
  const lastMonthStart = startOfMonth(subMonths(currentMonth, 1));
  const lastMonthEnd = endOfMonth(subMonths(currentMonth, 1));
  
  const lastMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return isWithinInterval(transactionDate, {
      start: lastMonthStart,
      end: lastMonthEnd
    });
  });

  // Calculate monthly income from income transactions
  const monthlyIncome = monthlyTransactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc;
  }, 0);

  // Calculate monthly expense
  const monthlyExpense = monthlyTransactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + Number(curr.amount) : acc;
  }, 0);

  // Calculate last month's closing balance
  const lastMonthClosingBalance = lastMonthTransactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate the display balance based on the month
  let displayBalance;
  if (monthlyTransactions.length > 0) {
    // If there are transactions in the current month, show income - expense
    displayBalance = monthlyIncome - monthlyExpense;
  } else {
    // If no transactions in current month, show last month's closing balance
    displayBalance = lastMonthClosingBalance;
  }

  console.log("Balance calculation:", {
    monthlyIncome,
    monthlyExpense,
    netBalance: monthlyIncome - monthlyExpense,
    displayBalance,
    currentTotalBalance,
    lastMonthClosingBalance,
    hasMonthlyTransactions: monthlyTransactions.length > 0
  });

  return (
    <div className="rounded-apple bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg p-8 transition-transform hover:scale-[1.02] duration-300">
      <div className="animate-fade-in">
        <h2 className="mb-3 text-sm font-medium text-white/90">Total Balance</h2>
        <p className="mb-3 text-5xl font-bold tracking-tight">{formatCurrency(displayBalance)}</p>
        <p className="mb-4 text-xs text-white/75">
          Last month's closing balance: {formatCurrency(lastMonthClosingBalance)}
        </p>
        <div className="h-px bg-white/20 mb-6" />
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-400/20 p-2.5 rounded-full">
              <ArrowDown className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-white/90">Income</p>
              <p className="text-xl font-semibold">{formatCurrency(monthlyIncome)}</p>
            </div>
          </div>
          <div className="w-px h-16 bg-white/20" />
          <div className="flex items-center gap-4">
            <div className="bg-rose-400/20 p-2.5 rounded-full">
              <ArrowUp className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-sm text-white/90">Expense</p>
              <p className="text-xl font-semibold">{formatCurrency(monthlyExpense)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};