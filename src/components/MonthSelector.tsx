import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { format, addMonths, subMonths } from "date-fns";

export const MonthSelector = () => {
  const { currentMonth, setCurrentMonth } = useFinance();

  const handlePrevMonth = () => {
    const newDate = subMonths(currentMonth, 1);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentMonth, 1);
    setCurrentMonth(newDate);
  };

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