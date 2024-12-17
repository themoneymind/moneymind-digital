import { PaymentSource } from "@/types/finance";
import { Transaction } from "@/types/transactions";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export type CreditCardUsage = {
  id: string;
  name: string;
  creditLimit: number;
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
  const calculateCreditCardUsage = (): CreditCardUsage[] => {
    return creditCards.map(card => {
      // Get monthly transactions for this card
      const monthlyTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const isCardTransaction = t.source === card.id;
        
        return isCardTransaction && isWithinInterval(transactionDate, {
          start: startOfMonth(currentMonth),
          end: endOfMonth(currentMonth)
        });
      });

      // Calculate total spent (excluding bill payments)
      const totalSpent = monthlyTransactions
        .filter(t => t.type === "expense" && t.category !== "Credit Card Bill")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      // Calculate total payments
      const totalPayments = monthlyTransactions
        .filter(t => t.category === "Credit Card Bill")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      // Calculate credit usage
      const creditLimit = Number(card.amount);
      const usedCredit = totalSpent - totalPayments;
      const availableCredit = creditLimit - usedCredit;
      const utilizationRate = (usedCredit / creditLimit) * 100;

      // Determine color based on utilization rate
      const getUtilizationColor = (rate: number) => {
        if (rate <= 30) return "bg-green-500";
        if (rate <= 70) return "bg-yellow-500";
        return "bg-red-500";
      };

      return {
        id: card.id,
        name: card.name,
        creditLimit,
        totalSpent,
        totalPayments,
        usedCredit: Math.max(0, usedCredit),
        availableCredit: Math.max(0, availableCredit),
        utilizationRate: Math.max(0, Math.min(100, utilizationRate)),
        utilizationColor: getUtilizationColor(utilizationRate)
      };
    });
  };

  return { calculateCreditCardUsage };
};