import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";

type TransactionFormActionsProps = {
  type: TransactionType;
  onSubmit: () => void;
};

export const TransactionFormActions = ({ type, onSubmit }: TransactionFormActionsProps) => {
  return (
    <Button
      className={`w-full h-12 rounded-[12px] text-sm font-medium text-white ${
        type === 'expense' 
          ? 'bg-transaction-expense hover:bg-transaction-expense/90' 
          : type === 'income'
          ? 'bg-transaction-income hover:bg-transaction-income/90'
          : type === 'transfer'
          ? 'bg-transaction-transfer hover:bg-transaction-transfer/90'
          : 'bg-primary hover:bg-primary/90'
      }`}
      onClick={onSubmit}
    >
      Add Transaction
    </Button>
  );
};