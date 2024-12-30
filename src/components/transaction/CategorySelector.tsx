import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionType } from "@/types/finance";

interface CategorySelectorProps {
  type: TransactionType;
  category: string;
  onCategoryChange: (category: string) => void;
  customCategories: {
    expense: string[];
    income: string[];
  };
  onAddCustomCategory: (category: string) => void;
}

export const CategorySelector = ({
  type,
  category,
  onCategoryChange,
  customCategories,
}: CategorySelectorProps) => {
  const categories = type === "expense" ? customCategories.expense : customCategories.income;

  return (
    <Select value={category} onValueChange={onCategoryChange}>
      <SelectTrigger className="h-14 rounded-[12px] border-gray-200">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-[12px] max-h-[300px] overflow-y-auto">
        {categories.map((cat) => (
          <SelectItem key={cat} value={cat} className="cursor-pointer">
            {cat}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};