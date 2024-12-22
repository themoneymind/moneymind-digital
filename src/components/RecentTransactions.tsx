import { useFinance } from "@/contexts/FinanceContext";
import { TransactionItem } from "./transaction/TransactionItem";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Transaction } from "@/types/transactions";

interface RecentTransactionsProps {
  showViewAll?: boolean;
}

export const RecentTransactions = ({ showViewAll = false }: RecentTransactionsProps) => {
  const { transactions } = useFinance();
  const navigate = useNavigate();
  
  const recentTransactions = transactions.slice(0, 5);

  const handleEdit = (transaction: Transaction) => {
    // This will be handled by the parent component when needed
    console.log('Edit transaction:', transaction);
  };

  const handleDelete = (id: string) => {
    // This will be handled by the parent component when needed
    console.log('Delete transaction:', id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toSentenceCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

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
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={handleEdit}
              onDelete={handleDelete}
              formatCurrency={formatCurrency}
              toSentenceCase={toSentenceCase}
            />
          ))
        )}
      </div>
    </div>
  );
};