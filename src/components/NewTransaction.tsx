import { Plus } from "lucide-react";
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

    // Reset form
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
    <div className="p-4 mx-4 bg-white rounded-xl">
      <h2 className="mb-4 text-lg font-semibold">New Transaction</h2>
      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          className={`flex-1 ${
            type === "expense"
              ? "bg-danger/10 text-danger border-danger/20"
              : ""
          }`}
          onClick={() => setType("expense")}
        >
          Expense
        </Button>
        <Button
          variant="outline"
          className={`flex-1 ${
            type === "income"
              ? "bg-success/10 text-success border-success/20"
              : ""
          }`}
          onClick={() => setType("income")}
        >
          Income
        </Button>
      </div>
      <div className="space-y-4">
        <Input
          type="number"
          placeholder="0"
          className="text-2xl"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
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
        <div className="flex items-center">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank">Bank Account</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Credit Card</SelectItem>
            </SelectContent>
          </Select>
          <Button size="icon" variant="ghost" className="ml-2">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <Input
          placeholder="Description or note (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Add Transaction
        </Button>
      </div>
    </div>
  );
};