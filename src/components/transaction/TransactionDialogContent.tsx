import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TransactionDialogContentProps {
  description: string;
  setDescription: (description: string) => void;
  amount: number;
  setAmount: (amount: number) => void;
  onSave: () => void;
  onDelete?: () => void;
  isSubmitting: boolean;
}

export const TransactionDialogContent = ({
  description,
  setDescription,
  amount,
  setAmount,
  onSave,
  onDelete,
  isSubmitting,
}: TransactionDialogContentProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Edit Transaction</DialogTitle>
      </DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="h-12 rounded-[12px]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-12 rounded-[12px]"
          />
        </div>

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
              className="flex-1 h-12 rounded-[12px] bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </>
  );
};