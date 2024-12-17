import { ArrowDown, ArrowUp, CreditCard } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { startOfMonth, endOfMonth, isWithinInterval, isBefore } from "date-fns";
import { formatCurrency } from "@/utils/formatCurrency";

export const CreditCardStack = () => {
  const { paymentSources, transactions, currentMonth } = useFinance();

  // Filter credit card sources
  const creditCards = paymentSources.filter(source => source.type === "credit");

  // Calculate credit usage for each card
  const creditCardUsage = creditCards.map(card => {
    // Get transactions for this card up to current month
    const cardTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const isCardTransaction = t.source === card.id;
      
      // For historical view, only include transactions up to selected month
      return isCardTransaction && isBefore(transactionDate, endOfMonth(currentMonth));
    });

    // Calculate monthly transactions
    const monthlyTransactions = cardTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return isWithinInterval(transactionDate, {
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
      });
    });

    // Calculate total spent and payments
    const totalSpent = monthlyTransactions
      .filter(t => t.type === "expense" && t.category !== "Credit Card Bill")
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const totalPayments = monthlyTransactions
      .filter(t => t.category === "Credit Card Bill")
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Calculate available credit
    const creditLimit = Number(card.amount);
    const usedCredit = totalSpent - totalPayments;
    const availableCredit = creditLimit - usedCredit;

    return {
      ...card,
      totalSpent,
      totalPayments,
      usedCredit,
      availableCredit,
      utilizationRate: (usedCredit / creditLimit) * 100
    };
  });

  if (creditCards.length === 0) {
    return null;
  }

  return (
    <div className="p-6 mx-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Credit Cards</h2>
      <div className="space-y-3">
        {creditCardUsage.map(card => (
          <div
            key={card.id}
            className="p-4 bg-white rounded-apple border border-gray-100 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{card.name}</p>
                  <p className="text-sm text-gray-500">
                    Limit: {formatCurrency(card.amount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${Math.min(card.utilizationRate, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-red-50 rounded-full">
                  <ArrowUp className="w-3 h-3 text-red-500" />
                </div>
                <div>
                  <p className="text-gray-500">Used</p>
                  <p className="font-medium text-gray-900">
                    {formatCurrency(card.usedCredit)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-green-50 rounded-full">
                  <ArrowDown className="w-3 h-3 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-500">Available</p>
                  <p className="font-medium text-gray-900">
                    {formatCurrency(card.availableCredit)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};