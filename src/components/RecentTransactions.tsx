import { useFinance } from "@/contexts/FinanceContext";
import { TransactionItem } from "./transaction/TransactionItem";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface RecentTransactionsProps {
  showViewAll?: boolean;
}

export const RecentTransactions = ({ showViewAll = false }: RecentTransactionsProps) => {
  const { transactions } = useFinance();
  const navigate = useNavigate();
  
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-6">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        {showViewAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/app/transactions")}
          >
            View All
          </Button>
        )}
      </div>
      
      <div className="px-6 space-y-4">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions yet
          </div>
        ) : (
          recentTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        )}
      </div>
    </div>
  );
};