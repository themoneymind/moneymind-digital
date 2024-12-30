import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";

interface TransactionDateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

export const TransactionDateSelector = ({
  selectedDate,
  onDateChange,
}: TransactionDateSelectorProps) => {
  const handlePrevDay = () => {
    const newDate = subDays(selectedDate, 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-[12px] h-14">
      <button 
        className="p-2 hover:bg-gray-50 rounded-l-[12px] h-full flex items-center justify-center px-4" 
        onClick={handlePrevDay}
        aria-label="Previous day"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>
      <span className="text-sm font-medium text-gray-900">
        {format(selectedDate, "MMMM d, yyyy")}
      </span>
      <button 
        className="p-2 hover:bg-gray-50 rounded-r-[12px] h-full flex items-center justify-center px-4" 
        onClick={handleNextDay}
        aria-label="Next day"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};