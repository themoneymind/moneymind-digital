import { Plus } from "lucide-react";
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

  const defaultExpenseCategories = ["Food", "Transport", "Shopping"];
  const defaultIncomeCategories = ["Salary", "Freelance", "Investment"];

  const categories = type === "expense" 
    ? [...defaultExpenseCategories, ...customCategories.expense]
    : [...defaultIncomeCategories, ...customCategories.income];

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
    
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  return (
    <div className="flex gap-2">
      <Select value={category} onValueChange={onCategoryChange}>
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
      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline" className="h-14 w-14 border-gray-200 rounded-[12px]">
            <Plus className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-[20px]">
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
              <Button onClick={handleAddCategory} className="h-14 rounded-[12px]">
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};