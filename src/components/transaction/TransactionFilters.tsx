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
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-8 h-8 bg-gray-100 border-0 hover:bg-gray-200"
          >
            <Calendar className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-[12px]" 
          align="end"
          side="bottom"
          sideOffset={5}
        >
          <CalendarComponent
            mode="single"
            selected={currentMonth}
            onSelect={handleDateSelect}
            initialFocus
            className="bg-white rounded-[12px]"
          />
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-8 h-8 bg-gray-100 border-0 hover:bg-gray-200"
          >
            <Filter className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-white border border-gray-200 shadow-lg rounded-[12px] p-1"
          side="bottom"
          sideOffset={5}
        >
          <DropdownMenuItem 
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
            onClick={() => setFilter("all")}
          >
            All Transactions
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
            onClick={() => setFilter("income")}
          >
            Income Only
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
            onClick={() => setFilter("expense")}
          >
            Expense Only
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
            onClick={() => onSourceSelect(null)}
          >
            All Payment Methods
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
            onClick={() => onSourceSelect("upi")}
          >
            UPI
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
            onClick={() => onSourceSelect("bank")}
          >
            Bank Account
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
            onClick={() => onSourceSelect("credit")}
          >
            Credit Card
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};