import { ArrowDown, ArrowUp } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { startOfMonth, endOfMonth, isWithinInterval, subMonths, endOfDay, isBefore } from "date-fns";

export const BalanceCard = () => {
  const { transactions, currentMonth } = useFinance();

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

  // Get all transactions before the current month for calculating previous balance
  const previousTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return isBefore(transactionDate, startOfMonth(currentMonth));
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

  // Calculate current month's income and expense
  const monthlyIncome = monthlyTransactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc;
  }, 0);

  const monthlyExpense = monthlyTransactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + Number(curr.amount) : acc;
  }, 0);

  // Calculate previous months' total balance (all transactions before current month)
  const previousBalance = previousTransactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
  }, 0);

  // Calculate last month's balance for display
  const lastMonthIncome = lastMonthTransactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc;
  }, 0);

  const lastMonthExpense = lastMonthTransactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + Number(curr.amount) : acc;
  }, 0);

  const lastMonthBalance = previousTransactions.length > 0 ? previousBalance : 0;

  // Calculate total balance as Previous Balance + Current Month's (Income - Expense)
  const totalBalance = previousBalance + (monthlyIncome - monthlyExpense);

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