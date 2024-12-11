import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { format, addMonths, subMonths } from "date-fns";
import { useEffect } from "react";

export const MonthSelector = () => {
  const { currentMonth, setCurrentMonth } = useFinance();

  const handlePrevMonth = () => {
    const newDate = subMonths(currentMonth, 1);
    newDate.setHours(0, 0, 0, 0);
    console.log("Previous month clicked:", { 
      current: format(currentMonth, 'yyyy-MM-dd'),
      new: format(newDate, 'yyyy-MM-dd')
    });
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentMonth, 1);
    newDate.setHours(0, 0, 0, 0);
    console.log("Next month clicked:", {
      current: format(currentMonth, 'yyyy-MM-dd'),
      new: format(newDate, 'yyyy-MM-dd')
    });
    setCurrentMonth(newDate);
  };

  // Check for month change every minute
  useEffect(() => {
    const checkMonthChange = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      if (now.getMonth() !== currentMonth.getMonth() || 
          now.getFullYear() !== currentMonth.getFullYear()) {
        console.log("Month changed automatically", {
          now: format(now, 'yyyy-MM-dd'),
          current: format(currentMonth, 'yyyy-MM-dd')
        });
        setCurrentMonth(now);
      }
    };

    checkMonthChange();
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