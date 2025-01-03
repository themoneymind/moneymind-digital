import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Transaction } from "@/types/transactions";
import { TransactionEditDialogContent } from "./TransactionEditDialogContent";

interface TransactionEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
}

export const TransactionEditSheet = ({
  open,
  onOpenChange,
  transaction,
}: TransactionEditSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="p-0 bg-transparent" closeButton={false}>
        <div className="bg-white pb-8 overflow-y-auto h-full">
          <div className="px-6">
            <TransactionEditDialogContent
              transaction={transaction}
              onOpenChange={onOpenChange}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};