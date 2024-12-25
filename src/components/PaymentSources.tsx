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
    // Filter transactions for this source
    const sourceTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.source === source.id && (
        isBefore(transactionDate, endOfMonth(currentMonth)) || 
        isEqual(startOfMonth(transactionDate), startOfMonth(currentMonth))
      );
    });

    // Calculate balance from transactions
    const balance = sourceTransactions.reduce((acc, curr) => {
      return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
    }, 0);

    return {
      ...source,
      amount: balance
    };
  });

  return (
    <div className="bg-white rounded-apple shadow-sm mt-6 mb-8">
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
      <div className="px-6 pb-6 space-y-3 max-h-[300px] overflow-y-auto">
        {sourcesWithBalances.map((source) => (
          <PaymentSourceCard key={source.id} source={source} />
        ))}
      </div>
    </div>
  );
};