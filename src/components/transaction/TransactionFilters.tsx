import { DateFilterButton } from "./DateFilterButton";
import { PaymentSourceFilterDropdown } from "./PaymentSourceFilterDropdown";
import { Button } from "@/components/ui/button";
import { Calendar, Filter } from "lucide-react";

type TransactionFiltersProps = {
  filter: "all" | "income" | "expense" | "date";
  setFilter: (filter: "all" | "income" | "expense" | "date") => void;
  currentMonth: Date;
  onSourceSelect: (sourceId: string | null) => void;
};

export const TransactionFilters = ({
  filter,
  setFilter,
  currentMonth,
  onSourceSelect,
}: TransactionFiltersProps) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFilter("date");
    } else {
      setFilter("all");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DateFilterButton
        currentMonth={currentMonth}
        onDateSelect={handleDateSelect}
        isActive={filter === "date"}
      />
      <Button
        variant="outline"
        className={`w-9 h-9 p-0 ${
          filter === "income" || filter === "expense"
            ? "bg-blue-50 text-blue-600 border-blue-200"
            : "bg-white border-gray-200"
        }`}
        onClick={() => setFilter(filter === "expense" ? "all" : "expense")}
      >
        <Filter className="h-4 w-4" />
      </Button>
      <PaymentSourceFilterDropdown onSourceSelect={onSourceSelect} />
    </div>
  );
};