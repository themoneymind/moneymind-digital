import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { IndianRupee, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFinance } from "@/contexts/FinanceContext";
import { startOfDay, endOfDay } from "date-fns";

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
  setCurrentMonth,
}: TransactionFiltersProps) => {
  const { paymentSources } = useFinance();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentMonth(date);
      setFilter("date");
    }
  };

  const getSourcesByType = () => {
    const sourceTypes = {
      bank: paymentSources.filter(source => source.type === 'bank'),
      upi: paymentSources.filter(source => source.type === 'upi'),
      credit_card: paymentSources.filter(source => source.type === 'credit_card'),
    };
    return sourceTypes;
  };

  const sourceTypes = getSourcesByType();

  return (
    <div className="flex gap-2 mb-4 flex-nowrap overflow-visible">
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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={`rounded-full w-9 h-9 p-0 ${
              filter === "date" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
            variant={filter === "date" ? "default" : "outline"}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-[12px]" align="start">
          <Calendar
            mode="single"
            selected={currentMonth}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-full w-9 h-9 p-0 bg-gray-100 text-gray-600 hover:bg-gray-200"
            variant="outline"
          >
            <IndianRupee className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-[12px] p-1">
          <DropdownMenuItem className="px-3 py-2 text-sm font-medium text-gray-900">
            Payment Sources
          </DropdownMenuItem>
          {Object.entries(sourceTypes).map(([type, sources]) => (
            <div key={type}>
              <div className="px-3 py-1 text-xs text-gray-500 capitalize">
                {type.replace('_', ' ')}
              </div>
              {sources.map((source) => (
                <DropdownMenuItem
                  key={source.id}
                  className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
                  onClick={() => setFilter("all")}
                >
                  <span>{source.name}</span>
                </DropdownMenuItem>
              ))}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};