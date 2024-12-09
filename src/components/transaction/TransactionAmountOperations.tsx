import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

type TransactionAmountOperationsProps = {
  amount: string;
  setAmount: (amount: string) => void;
};

export const TransactionAmountOperations = ({
  amount,
  setAmount,
}: TransactionAmountOperationsProps) => {
  return (
    <div className="space-y-4">
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