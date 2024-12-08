import { Plus, ArrowUp, ArrowDown, ShoppingBag, Car, Coffee, Briefcase, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";

const categoryIcons = {
  shopping: <ShoppingBag className="w-4 h-4" />,
  transport: <Car className="w-4 h-4" />,
  food: <Coffee className="w-4 h-4" />,
  salary: <Briefcase className="w-4 h-4" />,
  investment: <PiggyBank className="w-4 h-4" />,
};

export const NewTransaction = () => {
  const { addTransaction } = useFinance();
  const { toast } = useToast();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const handleSubmit = () => {
    if (!amount || (!category && !customCategory) || !source) {
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
      category: customCategory || category,
      source,
      description,
    });

    setAmount("");
    setCategory("");
    setCustomCategory("");
    setSource("");
    setDescription("");
    setShowCustomCategory(false);

    toast({
      title: "Success",
      description: "Transaction added successfully",
    });
  };

  return (
    <div className="p-6 mx-4 bg-white rounded-apple">
      <h2 className="mb-6 text-sm font-semibold text-gray-900">New Transaction</h2>
      <div className="flex gap-2 mb-6">
        <Button
          variant="outline"
          className={`flex-1 rounded-apple h-14 gap-2 ${
            type === "expense"
              ? "bg-red-50 text-red-500 border-red-100 hover:bg-red-50"
              : "bg-white hover:bg-gray-50"
          }`}
          onClick={() => setType("expense")}
        >
          <ArrowUp className="w-4 h-4" />
          <span className="text-sm">Expense</span>
        </Button>
        <Button
          variant="outline"
          className={`flex-1 rounded-apple h-14 gap-2 ${
            type === "income"
              ? "bg-green-50 text-green-500 border-green-100 hover:bg-green-50"
              : "bg-white hover:bg-gray-50"
          }`}
          onClick={() => setType("income")}
        >
          <ArrowDown className="w-4 h-4" />
          <span className="text-sm">Income</span>
        </Button>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
          <Input
            type="number"
            placeholder="0"
            className="text-lg pl-8 h-14 border-gray-200 rounded-apple"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {!showCustomCategory ? (
            <>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full h-14 border-gray-200 rounded-apple text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-apple bg-white">
                  {Object.entries(categoryIcons).map(([value, icon]) => (
                    <SelectItem key={value} value={value} className="flex items-center gap-2 text-sm">
                      {icon}
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                size="icon" 
                variant="outline" 
                className="h-14 w-14 border-gray-200 rounded-apple"
                onClick={() => setShowCustomCategory(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Input
              placeholder="Enter custom category"
              className="h-14 border-gray-200 rounded-apple text-sm"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          )}
        </div>
        <div className="flex gap-2">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-full h-14 border-gray-200 rounded-apple text-sm">
              <SelectValue placeholder="Select payment source" />
            </SelectTrigger>
            <SelectContent className="rounded-apple bg-white">
              <SelectItem value="bank" className="text-sm">Bank Account</SelectItem>
              <SelectItem value="cash" className="text-sm">Cash</SelectItem>
              <SelectItem value="card" className="text-sm">Credit Card</SelectItem>
            </SelectContent>
          </Select>
          <Button size="icon" variant="outline" className="h-14 w-14 border-gray-200 rounded-apple">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <Input
          placeholder="Description or note (Optional)"
          className="h-14 border-gray-200 rounded-apple text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          className="w-full h-14 bg-primary hover:bg-primary/90 rounded-apple text-sm font-medium"
          onClick={handleSubmit}
        >
          Add Transaction
        </Button>
      </div>
    </div>
  );
};