import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

type AmountOperationsProps = {
  operation: "add" | "subtract";
  setOperation: (op: "add" | "subtract") => void;
  amount: string;
  setAmount: (amount: string) => void;
};

export const AmountOperations = ({
  operation,
  setOperation,
  amount,
  setAmount,
}: AmountOperationsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={operation === "add" ? "default" : "outline"}
          onClick={() => setOperation("add")}
          className="flex-1 h-12 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
        <Button
          type="button"
          variant={operation === "subtract" ? "default" : "outline"}
          onClick={() => setOperation("subtract")}
          className="flex-1 h-12 gap-2"
        >
          <Minus className="w-4 h-4" />
          Subtract
        </Button>
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
        <Input
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="pl-8 h-12 text-lg rounded-[12px]"
        />
      </div>
    </div>
  );
};