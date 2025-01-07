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
          className={`rounded-full w-9 h-9 p-0 ${
            isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
          variant={isActive ? "default" : "outline"}
        >
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-[12px]" align="start">
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