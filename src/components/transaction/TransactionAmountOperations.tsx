import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

type AmountOperationsProps = {
  operation: "add" | "subtract";
  setOperation: (op: "add" | "subtract") => void;
  amount: string;
  setAmount: (amount: string) => void;
  currentAmount: number;
};

export const TransactionAmountOperations = ({
  operation,
  setOperation,
  amount,
  setAmount,
  currentAmount,
}: AmountOperationsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Current Amount:</span>
        <span className="text-lg font-semibold">{formatCurrency(currentAmount)}</span>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={operation === "add" ? "default" : "outline"}
          onClick={() => setOperation("add")}
          className={`flex-1 h-12 gap-2 rounded-xl hover:scale-105 transition-transform ${
            operation === "add" ? "bg-green-600 hover:bg-green-700" : ""
          }`}
        >
          <Plus className="w-5 h-5" />
          Add
        </Button>
        <Button
          type="button"
          variant={operation === "subtract" ? "default" : "outline"}
          onClick={() => setOperation("subtract")}
          className={`flex-1 h-12 gap-2 rounded-xl hover:scale-105 transition-transform ${
            operation === "subtract" ? "bg-red-600 hover:bg-red-700" : ""
          }`}
        >
          <Minus className="w-5 h-5" />
          Subtract
        </Button>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="pl-7 h-12 rounded-xl text-lg"
          placeholder="Enter amount to add/subtract"
        />
      </div>
    </div>
  );
};