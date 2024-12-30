import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionEditDialogForm } from "./TransactionEditDialogForm";
import { Transaction, RepeatOption } from "@/types/transactions";
import { useFinance } from "@/contexts/FinanceContext";

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
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  repeatOption: RepeatOption;
  onRepeatOptionChange: (option: RepeatOption) => void;
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
  selectedDate,
  onDateChange,
  repeatOption,
  onRepeatOptionChange,
}: TransactionEditDialogContentProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Edit Transaction</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
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
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          repeatOption={repeatOption}
          onRepeatOptionChange={onRepeatOptionChange}
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
              className="flex-1 h-12 rounded-[12px] bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </>
  );
};