import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RepeatOption } from "@/types/transactions";

interface RepeatSelectorProps {
  value: RepeatOption;
  onValueChange: (value: RepeatOption) => void;
}

export const RepeatSelector = ({ value, onValueChange }: RepeatSelectorProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-12 border-0 border-b-2 border-gray-200 focus:border-primary rounded-none text-sm text-gray-600 bg-transparent transition-colors hover:bg-transparent placeholder-gray-400">
        <SelectValue placeholder="Select repeat frequency" />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-[12px] max-h-[300px] overflow-y-auto">
        <SelectItem value="never" className="text-gray-600">Never Repeat</SelectItem>
        <SelectItem value="daily" className="text-gray-600">Every Day</SelectItem>
        <SelectItem value="workdays" className="text-gray-600">Every Work Day</SelectItem>
        <SelectItem value="weekly" className="text-gray-600">Every Week</SelectItem>
        <SelectItem value="biweekly" className="text-gray-600">Every Second Week</SelectItem>
        <SelectItem value="triweekly" className="text-gray-600">Every Third Week</SelectItem>
        <SelectItem value="monthly" className="text-gray-600">Every Month</SelectItem>
        <SelectItem value="bimonthly" className="text-gray-600">Every Second Month</SelectItem>
        <SelectItem value="quarterly" className="text-gray-600">Every Fourth Month</SelectItem>
        <SelectItem value="firstofmonth" className="text-gray-600">First Day of the Month</SelectItem>
        <SelectItem value="lastofmonth" className="text-gray-600">Last Day of the Month</SelectItem>
        <SelectItem value="semiannually" className="text-gray-600">Every Half Year</SelectItem>
        <SelectItem value="annually" className="text-gray-600">Every Year</SelectItem>
      </SelectContent>
    </Select>
  );
};