import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionEditDialogForm } from "./TransactionEditDialogForm";
import { Transaction } from "@/types/transactions";
import { useFinance } from "@/contexts/FinanceContext";
import { useTransactionEditForm } from "@/hooks/useTransactionEditForm";
import { ArrowLeftRight, ArrowDown, ArrowUp, X } from "lucide-react";

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
  const { getFormattedPaymentSources, deleteTransaction } = useFinance();
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

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

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
      <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
          {getIcon()}
          Edit {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </DialogTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="h-10 w-10 rounded-full p-2 hover:bg-red-100 text-red-500 hover:text-red-600"
        >
          <X className="h-5 w-5" />
        </Button>
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
            className="flex-1 h-12 rounded-[12px] bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
          >
            Save Changes
          </Button>
          <Button 
            type="button"
            onClick={handleDelete}
            variant="destructive"
            className="flex-1 h-12 rounded-[12px] bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </div>
      </form>
    </>
  );
};