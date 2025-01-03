import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type TransactionHeaderProps = {
  onClose: () => void;
};

export const TransactionHeader = ({ onClose }: TransactionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">New Transaction</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="hover:bg-gray-100 rounded-full"
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};