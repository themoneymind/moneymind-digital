import { Plus, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

export const NewTransaction = () => {
  const { addTransaction, getFormattedPaymentSources } = useFinance();
  const { toast } = useToast();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [customCategories, setCustomCategories] = useState<{
    expense: string[];
    income: string[];
  }>({
    expense: [],
    income: [],
  });

  const defaultExpenseCategories = ["Food", "Transport", "Shopping"];
  const defaultIncomeCategories = ["Salary", "Freelance", "Investment"];

  const formattedSources = getFormattedPaymentSources();

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    setCustomCategories((prev) => ({
      ...prev,
      [type]: [...prev[type], newCategory.trim()],
    }));

    setNewCategory("");
    
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  const handleSubmit = () => {
    if (!amount || !category || !source) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addTransaction({
      type,
      amount: Number(amount),
      category,
      source,
      description,
    });

    setAmount("");
    setCategory("");
    setSource("");
    setDescription("");

    toast({
      title: "Success",
      description: "Transaction added successfully",
    });
  };

  const categories = type === "expense" 
    ? [...defaultExpenseCategories, ...customCategories.expense]
    : [...defaultIncomeCategories, ...customCategories.income];

  return (
    <div className="p-6 mx-4 bg-white rounded-[20px]">
      <h2 className="mb-6 text-base font-semibold">New Transaction</h2>
      <div className="flex gap-2 mb-6">
        <Button
          variant="outline"
          className={`flex-1 rounded-[12px] h-14 gap-2 ${
            type === "expense"
              ? "bg-red-50 text-red-500 border-red-100 hover:bg-red-50"
              : "bg-white hover:bg-gray-50"
          }`}
          onClick={() => setType("expense")}
        >
          <ArrowUp className="w-4 h-4" />
          Expense
        </Button>
        <Button
          variant="outline"
          className={`flex-1 rounded-[12px] h-14 gap-2 ${
            type === "income"
              ? "bg-green-50 text-green-500 border-green-100 hover:bg-green-50"
              : "bg-white hover:bg-gray-50"
          }`}
          onClick={() => setType("income")}
        >
          <ArrowDown className="w-4 h-4" />
          Income
        </Button>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
          <Input
            type="number"
            placeholder="0"
            className="text-2xl pl-8 h-14 border-gray-200 rounded-[12px]"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
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
        <div className="flex gap-2">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-full h-14 border-gray-200 rounded-[12px]">
              <SelectValue placeholder="Select payment source" />
            </SelectTrigger>
            <SelectContent className="rounded-[12px] bg-white border-gray-200">
              {formattedSources.map((src) => (
                <SelectItem key={src.id} value={src.id}>
                  {src.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link to="/payment-source">
            <Button size="icon" variant="outline" className="h-14 w-14 border-gray-200 rounded-[12px]">
              <Plus className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        <Input
          placeholder="Description or note (Optional)"
          className="h-14 border-gray-200 rounded-[12px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-[12px]"
          onClick={handleSubmit}
        >
          Add Transaction
        </Button>
      </div>
    </div>
  );
};