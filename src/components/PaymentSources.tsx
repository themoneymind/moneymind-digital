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

  // Calculate balances for payment sources based on transactions
  const sourcesWithBalances = paymentSources.map(source => {
    // Get all transactions for this source up to the current month
    const previousTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.source === source.id && isBefore(transactionDate, startOfMonth(currentMonth));
    });

    // Calculate carryforward balance
    const carryForwardBalance = previousTransactions.reduce((acc, curr) => {
      return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
    }, 0);

    // Get current month's transactions
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.source === source.id && 
        isEqual(startOfMonth(transactionDate), startOfMonth(currentMonth));
    });

    // Calculate current month's balance
    const currentMonthBalance = currentMonthTransactions.reduce((acc, curr) => {
      return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
    }, 0);

    // Total balance is carryforward + current month
    const totalBalance = carryForwardBalance + currentMonthBalance;

    return {
      ...source,
      amount: totalBalance
    };
  });

  return (
    <div className="bg-white rounded-apple shadow-sm mt-8">
      <div className="flex items-center justify-between p-6">
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
      <div className="px-6 pb-4 space-y-3">
        {sourcesWithBalances.map((source) => (
          <PaymentSourceCard key={source.id} source={source} />
        ))}
      </div>
    </div>
  );
};