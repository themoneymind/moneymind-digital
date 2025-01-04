import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type DateFilterButtonProps = {
  currentMonth: Date;
  onDateSelect: (date: Date | undefined) => void;
  isActive: boolean;
};

export const DateFilterButton = ({
  currentMonth,
  onDateSelect,
  isActive,
}: DateFilterButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-9 h-9 p-0 ${
            isActive 
              ? "bg-blue-50 text-blue-600 border-blue-200" 
              : "bg-white border-gray-200"
          }`}
        >
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-lg" 
        align="start"
      >
        <Calendar
          mode="single"
          selected={currentMonth}
          onSelect={onDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};