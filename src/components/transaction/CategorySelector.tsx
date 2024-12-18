import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { TransactionType } from "@/types/finance";

type CategorySelectorProps = {
  type: TransactionType;
  category: string;
  onCategoryChange: (category: string) => void;
  customCategories: {
    expense: string[];
    income: string[];
  };
  onAddCustomCategory: (category: string) => void;
};

export const CategorySelector = ({
  type,
  category,
  onCategoryChange,
  customCategories,
  onAddCustomCategory,
}: CategorySelectorProps) => {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const defaultExpenseCategories = ["Food", "Transport", "Shopping"];
  const defaultIncomeCategories = ["Salary", "Freelance", "Investment"];

  // Ensure unique categories by using Set
  const uniqueCategories = Array.from(new Set([
    ...(type === "expense" ? customCategories.expense : customCategories.income),
    ...(type === "expense" ? defaultExpenseCategories : defaultIncomeCategories)
  ]));

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    onAddCustomCategory(newCategory.trim());
    setNewCategory("");
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  return (
    <div className="flex gap-2">
      <Select 
        value={category} 
        onValueChange={onCategoryChange}
        onOpenChange={(open) => {
          if (!open) {
            // Reset any temporary states when select closes
            console.log("Select closed, resetting states");
          }
        }}
      >
        <SelectTrigger className="w-full h-14 border-gray-200 rounded-[12px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="rounded-[12px] bg-white border-gray-200">
          {uniqueCategories.map((cat) => (
            <SelectItem 
              key={`${type}-${cat.toLowerCase()}`} 
              value={cat.toLowerCase()}
            >
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            size="icon" 
            variant="outline" 
            className="h-14 w-14 border-gray-200 rounded-[12px]"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent 
          className="sm:max-w-[425px] rounded-[20px]"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Add Custom Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="h-14 border-gray-200 rounded-[12px]"
              />
              <Button 
                onClick={handleAddCategory} 
                className="h-14 rounded-[12px]"
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};