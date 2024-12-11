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
import { Separator } from "@/components/ui/separator";

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
  const { transactions } = useFinance();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentMonth(date);
      setFilter("date");
    }
  };

  const calculateTotalsBySourceAndType = (sourceId: string, type: string) => {
    return transactions
      .filter(t => t.source === sourceId && t.type === type)
      .reduce((acc, t) => acc + Number(t.amount), 0);
  };

  const getSourceTransactions = () => {
    const sourceMap = new Map();
    
    transactions.forEach(transaction => {
      if (!sourceMap.has(transaction.source)) {
        sourceMap.set(transaction.source, {
          id: transaction.source,
          income: calculateTotalsBySourceAndType(transaction.source, "income"),
          expense: calculateTotalsBySourceAndType(transaction.source, "expense")
        });
      }
    });

    return Array.from(sourceMap.values());
  };

  const sourceTransactions = getSourceTransactions();

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
        <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg rounded-[12px] p-2">
          <div className="space-y-2">
            {sourceTransactions.map((source) => (
              <div key={source.id} className="px-2 py-1">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">
                    +{new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(source.income)}
                  </span>
                  <span className="text-red-600">
                    -{new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(source.expense)}
                  </span>
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};