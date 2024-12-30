import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TransactionType } from "@/types/finance";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  onAddCustomCategory,
}: CategorySelectorProps) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const categories = type === "expense" ? customCategories.expense : customCategories.income;

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCustomCategory(newCategory.trim());
      setNewCategory("");
      setShowAddCategory(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
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
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-14 w-14 border-gray-200 rounded-[12px] flex-shrink-0"
          onClick={() => setShowAddCategory(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="h-12 rounded-[12px]"
            />
            <Button 
              onClick={handleAddCategory}
              className="w-full h-12 rounded-[12px]"
              disabled={!newCategory.trim()}
            >
              Add Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};