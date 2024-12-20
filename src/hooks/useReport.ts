import { useState, useEffect } from "react";
import { Transaction } from "@/types/transactions";
import { useTransactions } from "./useTransactions";
import { format, startOfDay, startOfWeek, startOfMonth, startOfYear } from "date-fns";

type TimeFrame = "daily" | "weekly" | "monthly" | "yearly";

export const useReport = () => {
  const { fetchTransactions } = useTransactions();
  const [timeframe, setTimeframe] = useState<TimeFrame>("monthly");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [fetchTransactions]);

  const getStartDate = (date: Date, timeframe: TimeFrame) => {
    switch (timeframe) {
      case "daily":
        return startOfDay(date);
      case "weekly":
        return startOfWeek(date);
      case "monthly":
        return startOfMonth(date);
      case "yearly":
        return startOfYear(date);
    }
  };

  const prepareChartData = () => {
    return transactions.map(t => ({
      date: format(new Date(t.date), "MMM dd"),
      amount: t.type === 'expense' ? -Number(t.amount) : Number(t.amount)
    }));
  };

  const downloadReport = async (format: 'excel' | 'pdf') => {
    // Implementation for download functionality would go here
    console.log(`Downloading ${format} report...`);
  };

  return {
    timeframe,
    setTimeframe,
    prepareChartData,
    downloadReport,
    transactions,
    isLoading
  };
};