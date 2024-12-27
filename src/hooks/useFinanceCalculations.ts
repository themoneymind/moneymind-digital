import { Transaction } from "@/types/finance";

export const useFinanceCalculations = (transactions: Transaction[]) => {
  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
  }, 0);

  const income = transactions
    .filter(transaction => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expense = transactions
    .filter(transaction => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  return { balance, income, expense };
};
