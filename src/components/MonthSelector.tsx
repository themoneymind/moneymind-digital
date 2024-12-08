import { ArrowLeft, ArrowRight } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { format, addMonths, subMonths } from "date-fns";

export const MonthSelector = () => {
  const { currentMonth, setCurrentMonth } = useFinance();

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="flex items-center justify-between p-4 mx-4 bg-white rounded-apple shadow-lg">
      <button className="p-2 hover:bg-gray-50 rounded-apple" onClick={handlePrevMonth}>
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>
      <span className="text-base font-medium">{format(currentMonth, "MMMM yyyy")}</span>
      <button className="p-2 hover:bg-gray-50 rounded-apple" onClick={handleNextMonth}>
        <ArrowRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};