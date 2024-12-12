import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { useNavigate } from "react-router-dom";
import { PaymentSourceCard } from "./payment-source/PaymentSourceCard";
import { startOfMonth, endOfMonth, isBefore, isEqual } from "date-fns";

export const PaymentSources = () => {
  const { paymentSources, transactions, currentMonth } = useFinance();
  const navigate = useNavigate();

  const handleAddSource = () => {
    navigate("/app/payment-source");
  };

  // Calculate historical balances for payment sources
  const sourcesWithHistoricalBalances = paymentSources.map(source => {
    // If viewing current month, use current balance
    if (isEqual(startOfMonth(currentMonth), startOfMonth(new Date()))) {
      return source;
    }

    // Filter transactions for this source up to the selected month
    const sourceTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.source === source.id && isBefore(transactionDate, endOfMonth(currentMonth));
    });

    // Calculate historical balance
    const historicalBalance = sourceTransactions.reduce((acc, curr) => {
      return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
    }, 0);

    return {
      ...source,
      amount: historicalBalance
    };
  });

  return (
    <div className="p-6 mx-4 bg-white rounded-apple shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Payment Sources</h2>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-gray-100 rounded-[12px] w-8 h-8"
          onClick={handleAddSource}
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </Button>
      </div>
      <div className="space-y-3">
        {sourcesWithHistoricalBalances.map((source) => (
          <PaymentSourceCard key={source.id} source={source} />
        ))}
      </div>
    </div>
  );
};