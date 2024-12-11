import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { format, addMonths, subMonths } from "date-fns";
import { useEffect } from "react";

export const MonthSelector = () => {
  const { currentMonth, setCurrentMonth } = useFinance();

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Check for month change every minute
  useEffect(() => {
    const checkMonthChange = () => {
      const now = new Date();
      if (now.getMonth() !== currentMonth.getMonth() || 
          now.getFullYear() !== currentMonth.getFullYear()) {
        setCurrentMonth(now);
      }
    };

    // Initial check
    checkMonthChange();

    // Set up interval to check every minute
    const interval = setInterval(checkMonthChange, 60000);
    return () => clearInterval(interval);
  }, [currentMonth, setCurrentMonth]);

  return (
    <div className="flex items-center justify-between p-4 mx-4 bg-white rounded-apple shadow-sm">
      <button 
        className="p-2 hover:bg-gray-50 rounded-full" 
        onClick={handlePrevMonth}
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>
      <span className="text-sm font-medium text-gray-900">
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <button 
        className="p-2 hover:bg-gray-50 rounded-full" 
        onClick={handleNextMonth}
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};