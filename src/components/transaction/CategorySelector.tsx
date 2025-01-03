import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type CategorySelectorProps = {
  type: "expense" | "income" | "transfer";
  category: string;
  onCategoryChange: (category: string) => void;
  customCategories: {
    expense: string[];
    income: string[];
    transfer: string[];
  };
};

export const CategorySelector = ({
  type,
  category,
  onCategoryChange,
  customCategories,
}: CategorySelectorProps) => {
  const navigate = useNavigate();
  
  const defaultCategories = {
    expense: ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Others"],
    income: ["Salary", "Investment", "Gift", "Others"],
    transfer: ["Account Transfer", "Card Payment", "Investment Transfer", "Others"],
  };

  const categories = customCategories[type]?.length
    ? customCategories[type]
    : defaultCategories[type];

  return (
    <div className="flex gap-2 items-center">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="flex h-12 w-full rounded-[12px] border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="" disabled>
          Select category
        </option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-12 w-12 border-gray-200 rounded-[12px] flex-shrink-0"
        onClick={() => navigate("/app/categories")}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};