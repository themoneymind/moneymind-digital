import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";

interface TransactionDateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  type?: "expense" | "income" | "transfer";
}

export const TransactionDateSelector = ({
  selectedDate,
  onDateChange,
  type,
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

  const getFocusColor = () => {
    switch (type) {
      case 'expense':
        return 'focus-within:border-transaction-expense';
      case 'income':
        return 'focus-within:border-transaction-income';
      case 'transfer':
        return 'focus-within:border-transaction-transfer';
      default:
        return 'focus-within:border-primary';
    }
  };

  return (
    <div className={`flex items-center justify-between border-b-2 border-gray-200 py-2 transition-colors ${getFocusColor()}`}>
      <span className="text-sm text-gray-600">
        {format(selectedDate, "MMMM d, yyyy")}
      </span>
      <div className="flex items-center gap-2">
        <button 
          type="button"
          className="p-2 hover:bg-gray-50 rounded-[12px] h-full flex items-center justify-center" 
          onClick={handlePrevDay}
          aria-label="Previous day"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <button 
          type="button"
          className="p-2 hover:bg-gray-50 rounded-[12px] h-full flex items-center justify-center" 
          onClick={handleNextDay}
          aria-label="Next day"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};