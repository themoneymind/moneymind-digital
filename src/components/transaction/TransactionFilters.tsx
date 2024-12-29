import { Button } from "@/components/ui/button";
import { DateFilterButton } from "./DateFilterButton";
import { PaymentSourceFilterDropdown } from "./PaymentSourceFilterDropdown";
import { startOfDay, endOfDay, isEqual, format } from "date-fns";

type TransactionFiltersProps = {
  filter: "all" | "income" | "expense" | "date";
  setFilter: (filter: "all" | "income" | "expense" | "date") => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  onSourceSelect: (sourceId: string | null) => void;
};

export const TransactionFilters = ({ 
  filter, 
  setFilter,
  currentMonth,
  setCurrentMonth,
  onSourceSelect,
}: TransactionFiltersProps) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = startOfDay(date);
      console.log("Date filter selected:", {
        date: newDate.toISOString(),
        filter: "date"
      });
      setCurrentMonth(newDate);
      setFilter("date");
    }
  };

  const isToday = (date: Date) => {
    return isEqual(startOfDay(date), startOfDay(new Date()));
  };

  return (
    <div className="space-y-4">
      {filter === "date" && !isToday(currentMonth) && (
        <div className="text-sm text-gray-500 mt-2">
          Showing transactions for {format(currentMonth, "MMMM d, yyyy")}
        </div>
      )}
      <div className="flex gap-2 mb-4 flex-nowrap overflow-visible">
        <Button
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            filter === "all" 
              ? "bg-[#7F3DFF] text-white hover:bg-[#7F3DFF]/90" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => {
            setFilter("all");
            setCurrentMonth(startOfDay(new Date()));
          }}
        >
          All
        </Button>
        <Button
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            filter === "income" 
              ? "bg-[#7F3DFF] text-white hover:bg-[#7F3DFF]/90" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          variant={filter === "income" ? "default" : "outline"}
          onClick={() => setFilter("income")}
        >
          Income
        </Button>
        <Button
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            filter === "expense" 
              ? "bg-[#7F3DFF] text-white hover:bg-[#7F3DFF]/90" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          variant={filter === "expense" ? "default" : "outline"}
          onClick={() => setFilter("expense")}
        >
          Expense
        </Button>
        <DateFilterButton
          currentMonth={currentMonth}
          onDateSelect={handleDateSelect}
          isActive={filter === "date" && !isToday(currentMonth)}
        />
        <PaymentSourceFilterDropdown onSourceSelect={onSourceSelect} />
      </div>
    </div>
  );
};