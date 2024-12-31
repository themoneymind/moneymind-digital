import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionEditDialogForm } from "./TransactionEditDialogForm";
import { Transaction } from "@/types/transactions";
import { useFinance } from "@/contexts/FinanceContext";
import { useTransactionEditForm } from "@/hooks/useTransactionEditForm";
import { ArrowLeftRight, ArrowDown, ArrowUp } from "lucide-react";

export interface TransactionEditDialogContentProps {
  transaction: Transaction;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
}

export const TransactionEditDialogContent = ({
  transaction,
  onOpenChange,
  onDelete,
}: TransactionEditDialogContentProps) => {
  const { getFormattedPaymentSources } = useFinance();
  const formattedSources = getFormattedPaymentSources();

  const {
    operation,
    setOperation,
    amount,
    setAmount,
    selectedSource,
    setSelectedSource,
    description,
    setDescription,
    handleSubmit,
  } = useTransactionEditForm(transaction, () => {
    onOpenChange(false);
  });

  const getIcon = () => {
    switch (transaction.type) {
      case "expense":
        return <ArrowUp className="h-5 w-5 text-red-500" />;
      case "income":
        return <ArrowDown className="h-5 w-5 text-green-500" />;
      case "transfer":
        return <ArrowLeftRight className="h-5 w-5 text-[#7F3DFF]" />;
      default:
        return null;
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
          {getIcon()}
          Edit {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TransactionEditDialogForm
          currentAmount={Number(transaction.amount)}
          operation={operation}
          setOperation={setOperation}
          amount={amount}
          setAmount={setAmount}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          description={description}
          setDescription={setDescription}
          formattedSources={formattedSources}
          onDropdownOpenChange={() => {}}
          selectedDate={new Date(transaction.date)}
          onDateChange={() => {}}
          repeatFrequency={transaction.repeat_frequency || "never"}
          onRepeatChange={() => {}}
          transactionType={transaction.type}
        />
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="flex-1 h-12 rounded-[12px]"
          >
            Save Changes
          </Button>
          {onDelete && (
            <Button 
              type="button"
              onClick={onDelete}
              variant="destructive"
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