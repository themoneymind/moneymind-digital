import { useFinance } from "@/contexts/FinanceContext";
import { startOfMonth, endOfMonth, isWithinInterval, subMonths, isBefore } from "date-fns";
import { TotalBalance } from "./balance/TotalBalance";
import { MonthlyStats } from "./balance/MonthlyStats";

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

  // Get all transactions before the current month for previous balance
  const previousTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return isBefore(transactionDate, startOfMonth(currentMonth));
  });

  // Filter transactions for the last month
  const lastMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const lastMonthStart = startOfMonth(subMonths(currentMonth, 1));
    const lastMonthEnd = endOfMonth(subMonths(currentMonth, 1));
    
    return isWithinInterval(transactionDate, {
      start: lastMonthStart,
      end: lastMonthEnd
    });
  });

  // Calculate monthly income and expense (only for current month)
  const monthlyIncome = monthlyTransactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc;
  }, 0);

  const monthlyExpense = monthlyTransactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + Number(curr.amount) : acc;
  }, 0);

  // Calculate last month's balance
  const lastMonthIncome = lastMonthTransactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc;
  }, 0);

  const lastMonthExpense = lastMonthTransactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + Number(curr.amount) : acc;
  }, 0);

  const lastMonthBalance = lastMonthIncome - lastMonthExpense;

  // Calculate previous balance (all transactions before current month)
  const previousBalance = previousTransactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
  }, 0);

  // Calculate total balance as Previous Balance + Current Month's (Income - Expense)
  const totalBalance = previousBalance + (monthlyIncome - monthlyExpense);

  return (
    <div className="p-6 mx-4 rounded-apple bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg">
      <TotalBalance 
        totalBalance={totalBalance}
        previousBalance={previousBalance}
      />
      <MonthlyStats 
        monthlyIncome={monthlyIncome}
        monthlyExpense={monthlyExpense}
      />
    </div>
  );
};