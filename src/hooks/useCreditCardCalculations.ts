import { PaymentSource } from "@/types/finance";
import { Transaction } from "@/types/transactions";
import { startOfMonth, endOfMonth, isWithinInterval, isBefore } from "date-fns";

export type CreditCardUsage = {
  id: string;
  name: string;
  amount: number;
  totalSpent: number;
  totalPayments: number;
  usedCredit: number;
  availableCredit: number;
  utilizationRate: number;
  utilizationColor: string;
};

export const useCreditCardCalculations = (
  creditCards: PaymentSource[],
  transactions: Transaction[],
  currentMonth: Date
) => {
  const calculateCreditCardUsage = () => {
    return creditCards.map(card => {
      // Get all transactions for this card up to current month
      const cardTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const isCardTransaction = t.source === card.id;
        return isCardTransaction && isBefore(transactionDate, endOfMonth(currentMonth));
      });

      // Get transactions only for current month
      const monthlyTransactions = cardTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return isWithinInterval(transactionDate, {
          start: startOfMonth(currentMonth),
          end: endOfMonth(currentMonth)
        });
      });

      // Calculate total spent this month (excluding bill payments)
      const totalSpent = monthlyTransactions
        .filter(t => t.type === "expense" && t.category !== "Credit Card Bill")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      // Calculate total bill payments this month
      const totalPayments = monthlyTransactions
        .filter(t => t.category === "Credit Card Bill")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      // Calculate credit usage
      const creditLimit = Number(card.amount);
      const usedCredit = totalSpent - totalPayments;
      const availableCredit = creditLimit - usedCredit;
      const utilizationRate = (usedCredit / creditLimit) * 100;

      // Determine utilization color based on rate
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