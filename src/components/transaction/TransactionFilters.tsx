import { Button } from "@/components/ui/button";
import { Calendar, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { startOfDay } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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
    <div className="flex items-center gap-2 mb-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-9 h-9 bg-gray-100 border-0"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
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
            variant="outline"
            size="icon"
            className="rounded-full w-9 h-9 bg-gray-100 border-0"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white border border-gray-200 shadow-lg rounded-[12px] p-1"
        >
          <DropdownMenuItem onClick={() => setFilter("all")}>
            All Transactions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilter("income")}>
            Income Only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilter("expense")}>
            Expense Only
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onSourceSelect(null)}>
            All Payment Methods
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSourceSelect("upi")}>
            UPI
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSourceSelect("bank")}>
            Bank Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSourceSelect("credit")}>
            Credit Card
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Amount: ₹0-1000</DropdownMenuItem>
          <DropdownMenuItem>Amount: ₹1000-5000</DropdownMenuItem>
          <DropdownMenuItem>Amount: ₹5000+</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Morning Transactions</DropdownMenuItem>
          <DropdownMenuItem>Afternoon Transactions</DropdownMenuItem>
          <DropdownMenuItem>Evening Transactions</DropdownMenuItem>
          <DropdownMenuItem>Night Transactions</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Pending Transactions</DropdownMenuItem>
          <DropdownMenuItem>Completed Transactions</DropdownMenuItem>
          <DropdownMenuItem>Failed Transactions</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Recurring Transactions</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};