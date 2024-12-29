import { Button } from "@/components/ui/button";
import { DateFilterButton } from "./DateFilterButton";
import { PaymentSourceFilterDropdown } from "./PaymentSourceFilterDropdown";
import { startOfDay, format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, ListFilter } from "lucide-react";

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
      setCurrentMonth(newDate);
      setFilter("date");
    }
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white border-gray-200"
          >
            <ListFilter className="w-4 h-4" />
            <span>
              {filter === "all" && "All Transactions"}
              {filter === "income" && "Income"}
              {filter === "expense" && "Expense"}
              {filter === "date" && format(currentMonth, "MMM d, yyyy")}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => setFilter("all")}>
            All Transactions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilter("income")}>
            Income
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilter("expense")}>
            Expense
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DateFilterButton
        currentMonth={currentMonth}
        onDateSelect={handleDateSelect}
        isActive={filter === "date"}
      />
      
      <div className="ml-auto">
        <PaymentSourceFilterDropdown onSourceSelect={onSourceSelect} />
      </div>
    </div>
  );
};