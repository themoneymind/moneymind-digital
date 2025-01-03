import { X } from "lucide-react";

type TransactionHeaderProps = {
  onClose: () => void;
};

export const TransactionHeader = ({ onClose }: TransactionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pt-2">
      <h2 className="text-xl font-semibold">New Transaction</h2>
      <button 
        onClick={onClose}
        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};