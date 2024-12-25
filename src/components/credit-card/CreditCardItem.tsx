import { PaymentSource } from "@/types/finance";
import { formatCurrency } from "@/utils/formatters";
import { CreditCard } from "lucide-react";
import { format } from "date-fns";
import { useFinance } from "@/contexts/FinanceContext";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

interface CreditCardItemProps {
  card: PaymentSource;
}

export const CreditCardItem = ({ card }: CreditCardItemProps) => {
  const { transactions } = useFinance();
  const availableCredit = Number(card.credit_limit) - Math.abs(Number(card.amount));

  // Calculate this month's expenses for this card
  const currentMonth = new Date();
  const monthlyTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transaction.source === card.id &&
      transaction.type === "expense" &&
      isWithinInterval(transactionDate, {
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
      })
    );
  });

  const monthlyExpenses = monthlyTransactions.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="space-y-4">
      <div className="relative h-48 p-6 rounded-[20px] overflow-hidden bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to shadow-lg transform transition-transform hover:scale-[1.02]">
        {/* Decorative Circles - matching balance card style */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full transform translate-x-24 -translate-y-24" />
        <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/5 rounded-full transform -translate-x-16 translate-y-16" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">{card.name}</h3>
                {card.last_four_digits && (
                  <p className="text-sm text-white/80">
                    •••• {card.last_four_digits}
                  </p>
                )}
              </div>
            </div>
            {card.interest_rate && (
              <span className="text-sm text-white/80">
                {card.interest_rate}% APR
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/80">Current Balance</p>
              <p className="font-medium text-white">{formatCurrency(Math.abs(Number(card.amount)))}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">This Month's Expenses</p>
              <p className="font-medium text-white">{formatCurrency(monthlyExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      {(card.statement_date || card.due_date) && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-xl border border-gray-100">
          {card.statement_date && (
            <div>
              <p className="text-sm text-muted-foreground">Statement Date</p>
              <p className="text-sm font-medium">{format(new Date(card.statement_date), 'MMM dd, yyyy')}</p>
            </div>
          )}
          {card.due_date && (
            <div>
              <p className="text-sm text-muted-foreground">Payment Due</p>
              <p className="text-sm font-medium">{format(new Date(card.due_date), 'MMM dd, yyyy')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};