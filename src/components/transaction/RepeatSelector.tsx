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
      <SelectTrigger className="h-12 rounded-[12px] border-gray-200 text-sm bg-white">
        <SelectValue placeholder="Select repeat frequency" />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-[12px] max-h-[300px] overflow-y-auto">
        <SelectItem value="never">Never Repeat</SelectItem>
        <SelectItem value="daily">Every Day</SelectItem>
        <SelectItem value="workdays">Every Work Day</SelectItem>
        <SelectItem value="weekly">Every Week</SelectItem>
        <SelectItem value="biweekly">Every Second Week</SelectItem>
        <SelectItem value="triweekly">Every Third Week</SelectItem>
        <SelectItem value="monthly">Every Month</SelectItem>
        <SelectItem value="bimonthly">Every Second Month</SelectItem>
        <SelectItem value="quarterly">Every Fourth Month</SelectItem>
        <SelectItem value="firstofmonth">First Day of the Month</SelectItem>
        <SelectItem value="lastofmonth">Last Day of the Month</SelectItem>
        <SelectItem value="semiannually">Every Half Year</SelectItem>
        <SelectItem value="annually">Every Year</SelectItem>
      </SelectContent>
    </Select>
  );
};