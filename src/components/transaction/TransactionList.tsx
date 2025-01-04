import { Transaction } from "@/types/transactions";
import { TransactionItem } from "./TransactionItem";
import { format, isSameDay } from "date-fns";

type TransactionListProps = {
  transactions: Transaction[];
  filter: "all" | "income" | "expense" | "date";
  selectedDate: Date;
  selectedSource: string | null;
  onEdit: (transaction: Transaction) => void;
  formatCurrency: (amount: number) => string;
  toSentenceCase: (str: string) => string;
};

export const TransactionList = ({
  transactions,
  filter,
  selectedDate,
  selectedSource,
  onEdit,
  formatCurrency,
  toSentenceCase,
}: TransactionListProps) => {
  let filteredTransactions = transactions;

  // Apply date filter
  if (filter === "date") {
    filteredTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return isSameDay(transactionDate, selectedDate);
    });
  }

  // Apply transaction type filter
  if (filter === "income") {
    filteredTransactions = filteredTransactions.filter(t => t.type === "income");
  } else if (filter === "expense") {
    filteredTransactions = filteredTransactions.filter(t => t.type === "expense");
  }

  // Apply source filter
  if (selectedSource) {
    filteredTransactions = filteredTransactions.filter(t => t.source === selectedSource);
  }

  // Sort transactions by date (most recent first)
  filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (filteredTransactions.length === 0) {
    let message = "No transactions found";
    
    if (filter === "date") {
      const formattedDate = format(selectedDate, "MMMM d, yyyy");
      message = `No transactions found for ${formattedDate}. Try another date or view all transactions`;
    } else if (filter === "income") {
      message = "No income transactions found";
    } else if (filter === "expense") {
      message = "No expense transactions found";
    }

    return (
      <div className="text-center py-8 text-gray-500">
        {message}
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      {filteredTransactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          formatCurrency={formatCurrency}
          toSentenceCase={toSentenceCase}
        />
      ))}
    </div>
  );
};