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

interface BalanceCardProps {
  filterType?: "bank" | "credit";
}

export const BalanceCard = ({ filterType }: BalanceCardProps) => {
  const { transactions, currentMonth, paymentSources } = useFinance();

  // Filter payment sources based on type
  const filteredSources = filterType 
    ? paymentSources.filter(source => source.type?.toLowerCase() === filterType)
    : paymentSources;
  
  // Get credit cards for the carousel
  const creditCards = filterType === "credit" ? filteredSources : [];
  
  const { calculateCreditCardUsage } = useCreditCardCalculations(creditCards, transactions, currentMonth);
  const creditCardUsage = calculateCreditCardUsage();

  // Check if current selected month is in the future
  const isCurrentMonthFuture = isAfter(startOfMonth(currentMonth), startOfMonth(new Date()));
  const isCurrentMonth = isEqual(startOfMonth(currentMonth), startOfMonth(new Date()));

  // Calculate current total balance from filtered payment sources
  const currentTotalBalance = filteredSources.reduce((acc, curr) => acc + Number(curr.amount), 0);

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

  // Determine which balance to display based on the month
  const displayBalance = isCurrentMonth || isCurrentMonthFuture
    ? currentTotalBalance  // Show current balance for present and future months
    : historicalBalance;   // Show historical balance for past months

  return (
    <div className="relative overflow-hidden">
      <div className="flex flex-col gap-4">
        {/* Main Balance Card */}
        <div className="flex-[0_0_100%] min-w-0">
          <div className="p-6 mx-4 rounded-apple bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg">
            <BalanceInfo 
              displayBalance={displayBalance}
              lastMonthClosingBalance={lastMonthClosingBalance}
              monthlyIncome={monthlyIncome}
              monthlyExpense={monthlyExpense}
            />
          </div>
        </div>

        {/* Credit Cards Carousel - Only show for credit card tab */}
        {filterType === "credit" && creditCardUsage.length > 0 && (
          <CreditCardCarousel creditCardUsage={creditCardUsage} />
        )}
      </div>
    </div>
  );
};