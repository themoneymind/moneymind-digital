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
    <div className="flex items-center justify-between border-b-2 border-gray-200 focus-within:border-primary py-2 transition-colors">
      <span className="text-sm font-medium text-gray-900">
        {format(selectedDate, "MMMM d, yyyy")}
      </span>
      <div className="flex items-center gap-2">
        <button 
          type="button"
          className="p-2 hover:bg-gray-50 rounded-lg h-full flex items-center justify-center" 
          onClick={handlePrevDay}
          aria-label="Previous day"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <button 
          type="button"
          className="p-2 hover:bg-gray-50 rounded-lg h-full flex items-center justify-center" 
          onClick={handleNextDay}
          aria-label="Next day"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};