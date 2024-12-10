import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type TransactionFiltersProps = {
  filter: "all" | "income" | "expense" | "date";
  setFilter: (filter: "all" | "income" | "expense" | "date") => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
};

export const TransactionFilters = ({ 
  filter, 
  setFilter,
  currentMonth,
}: TransactionFiltersProps) => {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      <Button
        className={`rounded-apple px-4 py-1.5 text-sm whitespace-nowrap ${
          filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
        variant={filter === "all" ? "default" : "outline"}
        onClick={() => setFilter("all")}
      >
        All
      </Button>
      <Button
        className={`rounded-apple px-4 py-1.5 text-sm whitespace-nowrap ${
          filter === "income" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
        variant={filter === "income" ? "default" : "outline"}
        onClick={() => setFilter("income")}
      >
        Income
      </Button>
      <Button
        className={`rounded-apple px-4 py-1.5 text-sm whitespace-nowrap ${
          filter === "expense" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
        variant={filter === "expense" ? "default" : "outline"}
        onClick={() => setFilter("expense")}
      >
        Expense
      </Button>
      <Button
        className={`rounded-apple px-4 py-1.5 text-sm whitespace-nowrap ${
          filter === "date" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
        variant={filter === "date" ? "default" : "outline"}
        onClick={() => setFilter("date")}
      >
        {format(currentMonth, "MMM yyyy")}
      </Button>
    </div>
  );
};