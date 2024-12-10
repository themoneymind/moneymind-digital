import { Transaction } from "@/types/transactions";

export const useFinanceCalculations = (transactions: Transaction[]) => {
  const balance = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc - Number(curr.amount);
  }, 0);

  const income = transactions.reduce((acc, curr) => {
    return curr.type === "income" ? acc + Number(curr.amount) : acc;
  }, 0);

  const expense = transactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + Number(curr.amount) : acc;
  }, 0);

  return { balance, income, expense };
};