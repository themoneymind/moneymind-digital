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
import { CreditCardDisplay } from "./credit-card/CreditCardDisplay";
import useEmblaCarousel from 'embla-carousel-react';
import { useState, useCallback, useEffect } from "react";
import { useCreditCardCalculations } from "@/hooks/useCreditCardCalculations";

export const BalanceCard = () => {
  const { transactions, currentMonth, paymentSources } = useFinance();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'center',
    containScroll: 'trimSnaps'
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Get credit cards
  const creditCards = paymentSources.filter(source => 
    source.type?.toLowerCase() === "credit"
  );
  
  const { calculateCreditCardUsage } = useCreditCardCalculations(creditCards, transactions, currentMonth);
  const creditCardUsage = calculateCreditCardUsage();

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

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
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {/* Main Balance Card */}
          <div className="flex-[0_0_100%] min-w-0">
            <div className="p-6 mx-4 rounded-apple bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg">
              <h2 className="mb-2 text-sm font-medium opacity-90">Total Balance</h2>
              <p className="mb-2 text-4xl font-bold">{formatCurrency(displayBalance)}</p>
              <p className="mb-2 text-xs opacity-75">
                Last month's closing balance: {formatCurrency(lastMonthClosingBalance)}
              </p>
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
          </div>

          {/* Credit Cards */}
          {creditCardUsage.map((card, index) => (
            <div
              key={card.id}
              className="flex-[0_0_100%] min-w-0"
            >
              <div className="mx-4">
                <CreditCardDisplay 
                  card={card}
                  isSelected={selectedIndex === index}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Dots */}
      {creditCardUsage.length > 0 && (
        <div className="flex justify-center gap-1.5 mt-4">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              selectedIndex === 0 ? 'bg-white' : 'bg-white/30'
            }`}
          />
          {creditCardUsage.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                selectedIndex === index + 1 ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
