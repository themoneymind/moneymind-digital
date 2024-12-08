import { Plus, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";

export const NewTransaction = () => {
  const { addTransaction } = useFinance();
  const { toast } = useToast();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");

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

  return (
    <div className="p-6 mx-4 bg-white rounded-apple shadow-lg">
      <h2 className="mb-6 text-base font-semibold">New Transaction</h2>
      <div className="flex gap-2 mb-6">
        <Button
          variant="outline"
          className={`flex-1 rounded-apple h-10 gap-2 ${
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
          className={`flex-1 rounded-apple h-10 gap-2 ${
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
            className="text-2xl pl-8 h-14 border-gray-200 rounded-apple"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full h-11 border-gray-200 rounded-apple">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
            </SelectContent>
          </Select>
          <Button size="icon" variant="outline" className="h-11 w-11 border-gray-200 rounded-apple">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-full h-11 border-gray-200 rounded-apple">
              <SelectValue placeholder="Select payment source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank">Bank Account</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Credit Card</SelectItem>
            </SelectContent>
          </Select>
          <Button size="icon" variant="outline" className="h-11 w-11 border-gray-200 rounded-apple">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <Input
          placeholder="Description or note (Optional)"
          className="h-11 border-gray-200 rounded-apple"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-apple"
          onClick={handleSubmit}
        >
          Add Transaction
        </Button>
      </div>
    </div>
  );
};