import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type TransactionHeaderProps = {
  onClose: () => void;
};

export const TransactionHeader = ({ onClose }: TransactionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4 px-4">
      <h2 className="text-xl font-semibold">New Transaction</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="hover:bg-red-50 rounded-full text-red-500 hover:text-red-600 h-10 w-10"
      >
        <X className="h-8 w-8" />
      </Button>
    </div>
  );
};