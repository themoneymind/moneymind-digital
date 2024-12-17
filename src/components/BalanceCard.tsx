import { useFinance } from "@/contexts/FinanceContext";
import { 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval, 
  subMonths, 
  isAfter, 
  isBefore, 
  isEqual 
} from "date-fns";
import { useCreditCardCalculations } from "@/hooks/useCreditCardCalculations";
import { BalanceInfo } from "./balance/BalanceInfo";
import { CreditCardCarousel } from "./balance/CreditCardCarousel";

export const BalanceCard = () => {
  const { transactions, currentMonth, paymentSources } = useFinance();

  // Get credit cards
  const creditCards = paymentSources.filter(source => 
    source.type?.toLowerCase() === "credit"
  );
  
  const { calculateCreditCardUsage } = useCreditCardCalculations(creditCards, transactions, currentMonth);
  const creditCardUsage = calculateCreditCardUsage();

  // Get the earliest transaction date to determine when the user started using the app
  const earliestTransaction = transactions.length > 0 
    ? new Date(Math.min(...transactions.map(t => new Date(t.date).getTime())))
    : new Date();

  // Check if current selected month is in the future
  const isCurrentMonthFuture = isAfter(startOfMonth(currentMonth), startOfMonth(new Date()));
  const isCurrentMonth = isEqual(startOfMonth(currentMonth), startOfMonth(new Date()));

  // Calculate current total balance from payment sources
  const currentTotalBalance = paymentSources.reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Filter transactions up to the current month
  const transactionsUpToMonth = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return isBefore(transactionDate, endOfMonth(currentMonth));
  });

  // Calculate historical balance up to the selected month
  const historicalBalance = transactionsUpToMonth.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
  }, 0);

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

  // Calculate last month's closing balance
  const lastMonthClosingBalance = lastMonthTransactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
  }, 0);

  // Calculate monthly income from income transactions
  const monthlyIncome = monthlyTransactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc;
  }, 0);

  // Calculate monthly expense
  const monthlyExpense = monthlyTransactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + Number(curr.amount) : acc;
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Determine which balance to display based on the month
  const displayBalance = isCurrentMonth || isCurrentMonthFuture
    ? currentTotalBalance  // Show current balance for present and future months
    : historicalBalance;   // Show historical balance for past months

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="flex">
          {/* Main Balance Card */}
          <div className="flex-[0_0_100%] min-w-0">
            <div className="p-6 mx-4 rounded-apple bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg">
              <BalanceInfo 
                displayBalance={displayBalance}
                lastMonthClosingBalance={lastMonthClosingBalance}
                monthlyIncome={monthlyIncome}
                monthlyExpense={monthlyExpense}
                formatCurrency={formatCurrency}
              />
            </div>
          </div>

          {/* Credit Cards */}
          {creditCardUsage.length > 0 && (
            <CreditCardCarousel creditCardUsage={creditCardUsage} />
          )}
        </div>
      </div>
    </div>
  );
};