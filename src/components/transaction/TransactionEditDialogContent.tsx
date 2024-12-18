import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionEditDialogForm } from "./TransactionEditDialogForm";
import { Transaction } from "@/types/transactions";

interface TransactionEditDialogContentProps {
  transaction: Transaction;
  operation: "add" | "subtract";
  setOperation: (op: "add" | "subtract") => void;
  amount: string;
  setAmount: (amount: string) => void;
  selectedSource: string;
  setSelectedSource: (source: string) => void;
  description: string;
  setDescription: (description: string) => void;
  formattedSources: { id: string; name: string }[];
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  onDropdownOpenChange: (open: boolean) => void;
  currentAmount: number;
}

export const TransactionEditDialogContent = ({
  transaction,
  operation,
  setOperation,
  amount,
  setAmount,
  selectedSource,
  setSelectedSource,
  description,
  setDescription,
  formattedSources,
  onSubmit,
  isSubmitting,
  onDropdownOpenChange,
  currentAmount,
}: TransactionEditDialogContentProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Edit Transaction</DialogTitle>
      </DialogHeader>
      <div className="p-4 bg-gray-50 rounded-[12px] border border-gray-100 mb-4">
        <p className="text-sm text-gray-500 mb-1">Current Amount</p>
        <p className="text-lg font-semibold">{formatCurrency(currentAmount)}</p>
      </div>
      <form onSubmit={onSubmit}>
        <TransactionEditDialogForm
          currentAmount={currentAmount}
          operation={operation}
          setOperation={setOperation}
          amount={amount}
          setAmount={setAmount}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          description={description}
          setDescription={setDescription}
          formattedSources={formattedSources}
          onDropdownOpenChange={onDropdownOpenChange}
        />
        <Button 
          type="submit" 
          className="w-full h-12 rounded-[12px] mt-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </>
  );
};