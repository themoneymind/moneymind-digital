import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

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
  const [newCategory, setNewCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const defaultCategories = {
    expense: ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Others"],
    income: ["Salary", "Investment", "Gift", "Others"],
    transfer: ["Account Transfer", "Card Payment", "Investment Transfer", "Others"],
  };

  const categories = customCategories[type]?.length
    ? customCategories[type]
    : defaultCategories[type];

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast.error("Category already exists");
      return;
    }

    // Add the new category to the list
    const updatedCategories = [...categories, newCategory.trim()];
    customCategories[type] = updatedCategories;
    
    setNewCategory("");
    setIsOpen(false);
    toast.success("Category added successfully");
  };

  const getFocusColor = () => {
    switch (type) {
      case 'expense':
        return 'focus:border-transaction-expense';
      case 'income':
        return 'focus:border-transaction-income';
      case 'transfer':
        return 'focus:border-transaction-transfer';
      default:
        return 'focus:border-primary';
    }
  };

  const getButtonHoverColor = () => {
    switch (type) {
      case 'expense':
        return 'hover:bg-transaction-expense hover:text-white';
      case 'income':
        return 'hover:bg-transaction-income hover:text-white';
      case 'transfer':
        return 'hover:bg-transaction-transfer hover:text-white';
      default:
        return 'hover:bg-primary hover:text-white';
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={`flex h-12 w-full py-2 px-0 text-sm text-gray-600 placeholder-gray-200 bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors ${getFocusColor()}`}
      >
        <option value="" disabled className="text-gray-200">
          Select category
        </option>
        {categories.map((cat) => (
          <option key={cat} value={cat} className="text-gray-600">
            {cat}
          </option>
        ))}
      </select>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={`h-10 w-10 border-gray-200 rounded-[12px] flex-shrink-0 ${getButtonHoverColor()}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className={`h-12 py-2 px-0 text-sm bg-transparent border-b-2 border-gray-200 focus:outline-none transition-colors ${getFocusColor()}`}
            />
            <Button 
              onClick={handleAddCategory} 
              className={`w-full rounded-[12px] ${
                type === 'expense' 
                  ? 'bg-transaction-expense hover:bg-transaction-expense/90' 
                  : type === 'income'
                  ? 'bg-transaction-income hover:bg-transaction-income/90'
                  : type === 'transfer'
                  ? 'bg-transaction-transfer hover:bg-transaction-transfer/90'
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              Add Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};