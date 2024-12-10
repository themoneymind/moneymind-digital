import { useState } from "react";
import { Transaction } from "@/types/transactions";
import { useTransactions } from "./useTransactions";
import { format, startOfDay, startOfWeek, startOfMonth, startOfYear } from "date-fns";

type TimeFrame = "daily" | "weekly" | "monthly" | "yearly";

export const useReport = () => {
  const { transactions } = useTransactions();
  const [timeframe, setTimeframe] = useState<TimeFrame>("monthly");

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
    const groupedData = transactions.reduce((acc: Record<string, number>, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      const amount = transaction.type === 'expense' ? -Number(transaction.amount) : Number(transaction.amount);
      acc[date] = (acc[date] || 0) + amount;
      return acc;
    }, {});

    return Object.entries(groupedData).map(([date, amount]) => ({
      date,
      amount
    }));
  };

  const downloadReport = async (format: 'excel' | 'pdf') => {
    // Implementation for download functionality would go here
    // This would typically involve calling a backend API to generate the report
    console.log(`Downloading ${format} report...`);
  };

  return {
    timeframe,
    setTimeframe,
    prepareChartData,
    downloadReport,
  };
};