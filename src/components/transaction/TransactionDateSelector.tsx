import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";

interface TransactionDateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const TransactionDateSelector = ({
  selectedDate,
  onDateChange,
}: TransactionDateSelectorProps) => {
  const handlePrevDay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newDate = subDays(selectedDate, 1);
    onDateChange(newDate);
  };

  const handleNextDay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newDate = addDays(selectedDate, 1);
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl h-[50px] shadow-sm">
      <button 
        type="button"
        className="px-4 h-full flex items-center justify-center hover:bg-gray-50 rounded-l-2xl" 
        onClick={handlePrevDay}
        aria-label="Previous day"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>
      <span className="text-base font-medium text-gray-900">
        {format(selectedDate, "MMMM d, yyyy")}
      </span>
      <button 
        type="button"
        className="px-4 h-full flex items-center justify-center hover:bg-gray-50 rounded-r-2xl" 
        onClick={handleNextDay}
        aria-label="Next day"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};