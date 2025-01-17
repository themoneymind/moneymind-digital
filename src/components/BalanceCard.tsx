import { ArrowDown, ArrowUp } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval, 
  isFuture, 
  isAfter, 
  isEqual,
  isBefore
} from "date-fns";

export const BalanceCard = () => {
  const { transactions, currentMonth, paymentSources } = useFinance();

  // Filter out rejected transactions and credit card transactions
  const activeTransactions = transactions.filter(t => {
    // Exclude rejected transactions
    if (t.status === 'rejected') return false;
    
    // Find the source to check if it's a credit card
    const source = paymentSources.find(s => s.id === t.base_source_id);
    const isSourceCreditCard = source?.type === "Credit Card";
    
    // Include transaction if:
    // 1. It's not from a credit card source (regular bank transaction)
    // 2. OR it's a credit card payment transfer (we want to count these as expenses)
    return !isSourceCreditCard || (t.type === "transfer" && t.reference_type === "credit_card_payment");
  });

  // Get the earliest transaction date
  const earliestTransaction = activeTransactions.length > 0 
    ? new Date(Math.min(...activeTransactions.map(t => new Date(t.date).getTime())))
    : new Date();

  // Check if current selected month is in the future or present
  const isCurrentMonthFuture = isAfter(startOfMonth(currentMonth), startOfMonth(new Date()));
  const isCurrentMonth = isEqual(startOfMonth(currentMonth), startOfMonth(new Date()));

  // Filter transactions for all months up to the current selected month
  const allPreviousTransactions = activeTransactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return isBefore(transactionDate, startOfMonth(currentMonth));
  });

  // Calculate total balance from all previous months (carryforward)
  const carryForwardBalance = allPreviousTransactions.reduce((acc, curr) => {
    if (curr.type === "transfer" && curr.reference_type === "credit_card_payment") {
      return acc - Number(curr.amount); // Count credit card payments as expenses
    }
    if (curr.type === "transfer") {
      return acc; // Skip other transfers
    }
    return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
  }, 0);

  // Filter transactions for the current month
  const monthlyTransactions = activeTransactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    return isWithinInterval(transactionDate, {
      start: monthStart,
      end: monthEnd
    });
  });

  // Calculate monthly income and expense (excluding credit card transactions)
  const monthlyIncome = monthlyTransactions.reduce((acc, curr) => {
    if (curr.type === "transfer") {
      return acc; // Skip all transfers from income calculation
    }
    return curr.type === "income" ? acc + Number(curr.amount) : acc;
  }, 0);

  const monthlyExpense = monthlyTransactions.reduce((acc, curr) => {
    if (curr.type === "transfer" && curr.reference_type === "credit_card_payment") {
      return acc + Number(curr.amount); // Include credit card payments in expenses
    }
    if (curr.type === "transfer") {
      return acc; // Skip other transfers
    }
    return curr.type === "expense" ? acc + Number(curr.amount) : acc;
  }, 0);

  // Calculate last month's closing balance
  const lastMonthClosingBalance = allPreviousTransactions.reduce((acc, curr) => {
    if (curr.type === "transfer" && curr.reference_type === "credit_card_payment") {
      return acc - Number(curr.amount); // Count credit card payments as expenses
    }
    if (curr.type === "transfer") {
      return acc; // Skip other transfers
    }
    return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate the display balance including carryforward
  const displayBalance = carryForwardBalance + monthlyIncome - monthlyExpense;

  console.log("Balance calculation:", {
    monthlyIncome,
    monthlyExpense,
    carryForwardBalance,
    netBalance: monthlyIncome - monthlyExpense,
    displayBalance,
    lastMonthClosingBalance,
    hasMonthlyTransactions: monthlyTransactions.length > 0
  });

  return (
    <div className="rounded-apple bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg p-6 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full transform translate-x-24 -translate-y-24" />
      <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/5 rounded-full transform -translate-x-16 translate-y-16" />
      
      {/* Content */}
      <div className="relative z-10">
        <h2 className="mb-2 text-sm font-medium opacity-90">Total Balance</h2>
        <p className="mb-2 text-4xl font-bold">{formatCurrency(displayBalance)}</p>
        <p className="mb-2 text-xs opacity-75">
          Last month's closing balance: {formatCurrency(lastMonthClosingBalance)}
        </p>
        <div className="h-px bg-white/20 mb-4" />
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-start gap-3">
              <div className="bg-green-400/20 p-1.5 rounded-full mt-0.5">
                <ArrowDown className="w-3.5 h-3.5 text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-sm opacity-90">Income</p>
                <p className="text-lg font-semibold">{formatCurrency(monthlyIncome)}</p>
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
                <p className="text-sm opacity-90">Expense</p>
                <p className="text-lg font-semibold">{formatCurrency(monthlyExpense)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};