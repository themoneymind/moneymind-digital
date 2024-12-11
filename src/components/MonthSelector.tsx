import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { format, addMonths, subMonths } from "date-fns";
import { useEffect } from "react";

export const MonthSelector = () => {
  const { currentMonth, setCurrentMonth } = useFinance();

  const handlePrevMonth = () => {
    console.log("Previous month clicked, current:", currentMonth);
    const newDate = subMonths(currentMonth, 1);
    console.log("New date will be:", newDate);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    console.log("Next month clicked, current:", currentMonth);
    const newDate = addMonths(currentMonth, 1);
    console.log("New date will be:", newDate);
    setCurrentMonth(newDate);
  };

  // Check for month change every minute
  useEffect(() => {
    const checkMonthChange = () => {
      const now = new Date();
      if (now.getMonth() !== currentMonth.getMonth() || 
          now.getFullYear() !== currentMonth.getFullYear()) {
        console.log("Month changed automatically", { now, currentMonth });
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
        className="p-2 hover:bg-gray-50 rounded-full transition-colors" 
        onClick={handlePrevMonth}
        aria-label="Previous month"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>
      <span className="text-sm font-medium text-gray-900">
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <button 
        className="p-2 hover:bg-gray-50 rounded-full transition-colors" 
        onClick={handleNextMonth}
        aria-label="Next month"
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};