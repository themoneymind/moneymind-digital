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

const DEFAULT_CATEGORIES = {
  expense: [
    "Food",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
    "Education",
    "Others"
  ],
  income: [
    "Salary",
    "Business",
    "Investment",
    "Gift",
    "Others"
  ],
  transfer: [
    "Fund Transfer",
    "Credit Card Payment",
    "Transfer to Wallet",
    "Investment Transfer",
    "Loan Payment",
    "Others"
  ]
};

export const CategorySelector = ({
  type,
  category,
  onCategoryChange,
  customCategories,
  onAddCustomCategory,
}: CategorySelectorProps) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  
  const allCategories = {
    expense: [...DEFAULT_CATEGORIES.expense, ...customCategories.expense],
    income: [...DEFAULT_CATEGORIES.income, ...customCategories.income],
    transfer: [...DEFAULT_CATEGORIES.transfer, ...customCategories.transfer],
  };

  const categories = allCategories[type] || [];

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
          <SelectTrigger className="h-10 rounded-xl border-gray-200">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl max-h-[300px] overflow-y-auto">
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
          className="h-10 w-10 border-gray-200 rounded-xl flex-shrink-0"
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
              className="h-10 rounded-xl"
            />
            <Button 
              onClick={handleAddCategory}
              className="w-full h-10 rounded-xl"
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
