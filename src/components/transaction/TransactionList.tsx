import { Transaction } from "@/types/transactions";
import { TransactionItem } from "./TransactionItem";

type TransactionListProps = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
  toSentenceCase: (str: string) => string;
};

export const TransactionList = ({
  transactions,
  onEdit,
  onDelete,
  formatCurrency,
  toSentenceCase,
}: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions found
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2 overflow-hidden">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
          formatCurrency={formatCurrency}
          toSentenceCase={toSentenceCase}
        />
      ))}
    </div>
  );
};