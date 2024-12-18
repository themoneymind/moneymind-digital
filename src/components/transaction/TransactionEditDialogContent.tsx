import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionEditDialogForm } from "./TransactionEditDialogForm";
import { Transaction } from "@/types/transactions";
import { formatCurrency } from "@/utils/formatters";

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
  onDelete?: () => void;
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
  onDelete,
}: TransactionEditDialogContentProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Edit Transaction</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-[12px] border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Current Amount</p>
          <p className="text-lg font-semibold">{formatCurrency(currentAmount)}</p>
        </div>
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
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="flex-1 h-12 rounded-[12px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          {onDelete && (
            <Button 
              type="button"
              variant="destructive"
              onClick={onDelete}
              className="flex-1 h-12 rounded-[12px]"
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </>
  );
};