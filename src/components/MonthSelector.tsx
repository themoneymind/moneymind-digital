import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { format, addMonths, subMonths, isSameMonth } from "date-fns";

export const MonthSelector = () => {
  const { currentMonth, setCurrentMonth } = useFinance();

  if (!currentMonth || !setCurrentMonth) {
    return null;
  }

  const handlePrevMonth = () => {
    const newDate = subMonths(currentMonth, 1);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentMonth, 1);
    
    // If we're moving to the current month, reset to today's date
    const today = new Date();
    if (isSameMonth(newDate, today)) {
      setCurrentMonth(today);
    } else {
      setCurrentMonth(newDate);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-apple shadow-sm p-4 w-full mb-4">
      <button 
        className="p-2 hover:bg-gray-50 rounded-full transition-colors" 
        onClick={handlePrevMonth}
        aria-label="Previous month"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>
      <span className="text-sm font-medium text-gray-900">
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <button 
        className="p-2 hover:bg-gray-50 rounded-full transition-colors" 
        onClick={handleNextMonth}
        aria-label="Next month"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};