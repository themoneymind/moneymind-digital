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
      <SheetContent side="bottom" className="h-[95vh] p-0 rounded-t-[28px] overflow-hidden" closeButton={false}>
        <div className="bg-white rounded-t-[28px] pb-8 overflow-y-auto h-full">
          <div className="mx-auto h-2 w-[100px] rounded-full bg-gray-200 my-3" />
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