import { Transaction } from "@/types/transactions";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { format } from "date-fns";
import { useFinance } from "@/contexts/FinanceContext";
import { getBaseSourceId } from "@/utils/paymentSourceUtils";

type TransactionItemProps = {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  formatCurrency: (amount: number) => string;
  toSentenceCase: (str: string) => string;
};

export const TransactionItem = ({
  transaction,
  onEdit,
  formatCurrency,
  toSentenceCase,
}: TransactionItemProps) => {
  const { paymentSources } = useFinance();
  
  const getFormattedSourceName = () => {
    const baseSourceId = getBaseSourceId(transaction.source);
    const source = paymentSources.find(s => s.id === baseSourceId);
    if (!source) return "";

    // Check if the transaction source includes a UPI app
    const sourceIdParts = transaction.source.split("-");
    if (sourceIdParts.length > 1) {
      const upiApp = sourceIdParts[1].toUpperCase();
      // Remove "Bank" from the name if it's a UPI transaction
      const nameWithoutBank = source.name.replace(" Bank", "");
      return `${nameWithoutBank} ${upiApp}`;
    }
    
    // For regular bank transactions, return the name as is
    return source.name;
  };

  return (
    <div 
      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-xl border border-gray-100 cursor-pointer"
      onClick={() => onEdit(transaction)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          transaction.type === "expense" 
            ? "bg-red-50" 
            : "bg-green-50"
        }`}>
          {transaction.type === "expense" ? (
            <ArrowUpRight className="w-4 h-4 text-red-500" />
          ) : (
            <ArrowDownLeft className="w-4 h-4 text-green-500" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {toSentenceCase(transaction.category)}
          </span>
          <div className="flex flex-col text-xs text-gray-500">
            <span>{getFormattedSourceName()}</span>
            <span>{format(new Date(transaction.date), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
      <span
        className={`text-sm font-medium ${
          transaction.type === "expense" ? "text-red-600" : "text-green-600"
        }`}
      >
        {transaction.type === "expense" ? "-" : "+"}
        {formatCurrency(Number(transaction.amount))}
      </span>
    </div>
  );
};