import { Button } from "@/components/ui/button";
import { DateFilterButton } from "./DateFilterButton";
import { PaymentSourceFilterDropdown } from "./PaymentSourceFilterDropdown";
import { startOfDay, endOfDay, format } from "date-fns";

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

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        className={`rounded-full px-3 py-1.5 text-xs ${
          filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
        variant={filter === "all" ? "default" : "outline"}
        onClick={() => setFilter("all")}
      >
        All
      </Button>
      <Button
        className={`rounded-full px-3 py-1.5 text-xs ${
          filter === "income" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
        variant={filter === "income" ? "default" : "outline"}
        onClick={() => setFilter("income")}
      >
        Income
      </Button>
      <Button
        className={`rounded-full px-3 py-1.5 text-xs ${
          filter === "expense" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
        variant={filter === "expense" ? "default" : "outline"}
        onClick={() => setFilter("expense")}
      >
        Expense
      </Button>
      
      <div className="flex items-center gap-2 ml-auto">
        {filter === "date" && (
          <span className="text-xs text-gray-600">
            {format(currentMonth, "MMM d, yyyy")}
          </span>
        )}
        <DateFilterButton
          currentMonth={currentMonth}
          onDateSelect={handleDateSelect}
          isActive={filter === "date"}
        />
        <PaymentSourceFilterDropdown onSourceSelect={onSourceSelect} />
      </div>
    </div>
  );
};