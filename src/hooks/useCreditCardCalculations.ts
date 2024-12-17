import { PaymentSource } from "@/types/finance";
import { Transaction } from "@/types/transactions";
import { startOfMonth, endOfMonth, isWithinInterval, isBefore } from "date-fns";

export const useCreditCardCalculations = (
  creditCards: PaymentSource[],
  transactions: Transaction[],
  currentMonth: Date
) => {
  const calculateCreditCardUsage = () => {
    return creditCards.map(card => {
      const cardTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const isCardTransaction = t.source === card.id;
        return isCardTransaction && isBefore(transactionDate, endOfMonth(currentMonth));
      });

      const monthlyTransactions = cardTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return isWithinInterval(transactionDate, {
          start: startOfMonth(currentMonth),
          end: endOfMonth(currentMonth)
        });
      });

      const totalSpent = monthlyTransactions
        .filter(t => t.type === "expense" && t.category !== "Credit Card Bill")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      const totalPayments = monthlyTransactions
        .filter(t => t.category === "Credit Card Bill")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      const creditLimit = Number(card.amount);
      const usedCredit = totalSpent - totalPayments;
      const availableCredit = creditLimit - usedCredit;
      const utilizationRate = (usedCredit / creditLimit) * 100;

      const getUtilizationColor = (rate: number) => {
        if (rate <= 30) return "bg-green-500";
        if (rate <= 70) return "bg-yellow-500";
        return "bg-red-500";
      };

      return {
        ...card,
        totalSpent,
        totalPayments,
        usedCredit,
        availableCredit,
        utilizationRate,
        utilizationColor: getUtilizationColor(utilizationRate)
      };
    });
  };

  return { calculateCreditCardUsage };
};