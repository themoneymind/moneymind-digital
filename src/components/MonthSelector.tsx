import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/contexts/FinanceContext";
import { format } from "date-fns";

export const MonthSelector = () => {
  const { currentMonth, setCurrentMonth } = useFinance();

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePreviousMonth}
        className="hover:bg-gray-100"
      >
        <ArrowBigLeft className="w-6 h-6 text-gray-600" />
      </Button>
      <h2 className="text-lg font-semibold">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextMonth}
        className="hover:bg-gray-100"
      >
        <ArrowBigRight className="w-6 h-6 text-gray-600" />
      </Button>
    </div>
  );
};