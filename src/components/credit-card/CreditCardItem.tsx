import { PaymentSource } from "@/types/finance";
import { CreditCardHeader } from "./CreditCardHeader";
import { CreditCardBalance } from "./CreditCardBalance";
import { CreditUtilization } from "./CreditUtilization";
import { CreditCardDates } from "./CreditCardDates";

interface CreditCardItemProps {
  card: PaymentSource;
}

export const CreditCardItem = ({ card }: CreditCardItemProps) => {
  const usedCredit = Number(card.amount) < 0 ? Math.abs(Number(card.amount)) : Number(card.amount);
  const availableCredit = Number(card.credit_limit) - usedCredit;
  const utilization = card.credit_limit ? (usedCredit / Number(card.credit_limit)) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="relative p-6 rounded-apple overflow-hidden bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to text-white shadow-lg transform transition-transform hover:scale-[1.02]">
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full transform translate-x-24 -translate-y-24" />
        <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/5 rounded-full transform -translate-x-16 translate-y-16" />
        
        <div className="relative space-y-4">
          <CreditCardHeader 
            name={card.name} 
            lastFourDigits={card.last_four_digits} 
          />

          <CreditCardBalance 
            usedCredit={usedCredit}
            availableCredit={availableCredit}
          />

          <CreditUtilization 
            utilization={utilization}
            usedCredit={usedCredit}
            creditLimit={Number(card.credit_limit)}
          />
        </div>
      </div>

      <CreditCardDates 
        statementDate={card.statement_date}
        dueDate={card.due_date}
      />
    </div>
  );
};