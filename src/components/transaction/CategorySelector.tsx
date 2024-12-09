import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionType } from "@/types/finance";

type CategorySelectorProps = {
  value: string;
  onChange: (category: string) => void;
};

export const CategorySelector = ({
  value,
  onChange,
}: CategorySelectorProps) => {
  const defaultExpenseCategories = ["Food", "Transport", "Shopping"];
  const defaultIncomeCategories = ["Salary", "Freelance", "Investment"];

  const categories = [...defaultExpenseCategories, ...defaultIncomeCategories];

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-14 border-gray-200 rounded-[12px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="rounded-[12px] bg-white border-gray-200">
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat.toLowerCase()}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};