import { Plus } from "lucide-react";
import { useState, useCallback } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      onAddCustomCategory(newCategory.trim());
      setNewCategory("");
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultExpenseCategories = ["Food", "Transport", "Shopping"];
  const defaultIncomeCategories = ["Salary", "Freelance", "Investment"];

  const uniqueCategories = Array.from(new Set([
    ...(type === "expense" ? customCategories.expense : customCategories.income),
    ...(type === "expense" ? defaultExpenseCategories : defaultIncomeCategories)
  ])).map(cat => ({
    id: `${type}-${cat.toLowerCase()}`,
    name: cat
  }));

  const handleDialogChange = useCallback((open: boolean) => {
    if (!open && !isSubmitting) {
      setIsDialogOpen(false);
    }
  }, [isSubmitting]);

  return (
    <div className="flex gap-2">
      <Select 
        value={category} 
        onValueChange={onCategoryChange}
      >
        <SelectTrigger className="w-full h-14 border-gray-200 rounded-[12px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-[12px] max-h-[300px] overflow-y-auto z-50">
          {uniqueCategories.map(({ id, name }) => (
            <SelectItem 
              key={id}
              value={name.toLowerCase()}
              className="hover:bg-gray-50"
            >
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <Button 
            size="icon" 
            variant="outline" 
            className="h-14 w-14 border-gray-200 rounded-[12px]"
            type="button"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent 
          className="sm:max-w-[425px] bg-white rounded-[20px] shadow-lg border border-gray-200"
          onPointerDownOutside={(e) => {
            if (isSubmitting) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (isSubmitting) {
              e.preventDefault();
            }
          }}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};