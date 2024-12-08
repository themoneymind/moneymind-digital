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
    <div className="flex items-center justify-between p-4 mx-4 bg-white rounded-lg">
      <button className="p-2" onClick={handlePrevMonth}>
        <ArrowLeft className="w-5 h-5" />
      </button>
      <span className="text-lg font-medium">{format(currentMonth, "MMMM yyyy")}</span>
      <button className="p-2" onClick={handleNextMonth}>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};