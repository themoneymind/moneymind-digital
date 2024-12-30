import { Button } from "@/components/ui/button";
import { CategorySelector } from "../CategorySelector";
import { Plus } from "lucide-react";

interface CategoryManagerProps {
  type: "expense" | "income";
  category: string;
  onCategoryChange: (category: string) => void;
  customCategories: {
    expense: string[];
    income: string[];
  };
  onAddCustomCategory: (category: string) => void;
}

export const CategoryManager = ({
  type,
  category,
  onCategoryChange,
  customCategories,
  onAddCustomCategory,
}: CategoryManagerProps) => {
  return (
    <div className="flex gap-2">
      <CategorySelector
        type={type}
        category={category}
        onCategoryChange={onCategoryChange}
        customCategories={customCategories}
        onAddCustomCategory={onAddCustomCategory}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-14 w-14 border-gray-200 rounded-[12px] flex-shrink-0"
        onClick={() => {
          const newCategory = window.prompt("Enter new category name");
          if (newCategory) {
            onAddCustomCategory(newCategory);
          }
        }}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};