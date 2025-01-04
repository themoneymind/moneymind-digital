import { RepeatOption } from "@/types/transactions";
import { ChevronDown } from "lucide-react";

interface RepeatSelectorProps {
  value: RepeatOption;
  onValueChange: (value: RepeatOption) => void;
}

export const RepeatSelector = ({ value, onValueChange }: RepeatSelectorProps) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value as RepeatOption)}
        className="w-full h-12 border-0 border-b-2 border-gray-200 focus:border-primary rounded-none text-sm text-gray-600 bg-transparent transition-colors hover:bg-transparent placeholder-gray-400 focus:outline-none appearance-none pr-8"
      >
        <option value="never">Never Repeat</option>
        <option value="daily">Every Day</option>
        <option value="workdays">Every Work Day</option>
        <option value="weekly">Every Week</option>
        <option value="biweekly">Every Second Week</option>
        <option value="triweekly">Every Third Week</option>
        <option value="monthly">Every Month</option>
        <option value="bimonthly">Every Second Month</option>
        <option value="quarterly">Every Fourth Month</option>
        <option value="firstofmonth">First Day of the Month</option>
        <option value="lastofmonth">Last Day of the Month</option>
        <option value="semiannually">Every Half Year</option>
        <option value="annually">Every Year</option>
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  );
};