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
  const { paymentSources, transactions } = useFinance();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentMonth(date);
      setFilter("date");
    }
  };

  const calculateTotalsByType = (type: string) => {
    return transactions
      .filter(t => t.type === type)
      .reduce((acc, t) => acc + Number(t.amount), 0);
  };

  const totalIncome = calculateTotalsByType("income");
  const totalExpense = calculateTotalsByType("expense");

  const getSourcesByType = (type: string) => {
    return paymentSources.filter(source => source.type === type);
  };

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
          <div className="flex justify-between mb-2 px-2">
            <div className="text-sm text-green-600">
              Income: {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(totalIncome)}
            </div>
            <div className="text-sm text-red-600">
              Expense: {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(totalExpense)}
            </div>
          </div>
          <Separator className="my-2" />
          <div className="space-y-2">
            <div className="px-2 py-1">
              <h3 className="text-sm font-medium text-gray-900">Bank Accounts</h3>
              {getSourcesByType("bank").map((source) => (
                <DropdownMenuItem
                  key={source.id}
                  className="flex items-center justify-between px-2 py-1 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
                >
                  <span>{source.name}</span>
                  <span className="text-gray-500">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(source.amount)}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <div className="px-2 py-1">
              <h3 className="text-sm font-medium text-gray-900">Credit Cards</h3>
              {getSourcesByType("credit").map((source) => (
                <DropdownMenuItem
                  key={source.id}
                  className="flex items-center justify-between px-2 py-1 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
                >
                  <span>{source.name}</span>
                  <span className="text-gray-500">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(source.amount)}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <div className="px-2 py-1">
              <h3 className="text-sm font-medium text-gray-900">UPI</h3>
              {getSourcesByType("upi").map((source) => (
                <DropdownMenuItem
                  key={source.id}
                  className="flex items-center justify-between px-2 py-1 text-sm cursor-pointer hover:bg-gray-50 rounded-[8px]"
                >
                  <span>{source.name}</span>
                  <span className="text-gray-500">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(source.amount)}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};