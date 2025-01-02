import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Transaction } from "@/types/transactions";
import { TransactionEditDialogContent } from "./TransactionEditDialogContent";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <SheetContent side="bottom" className="h-[95vh] p-0 rounded-t-[28px] overflow-hidden">
        <div className="bg-white rounded-t-[28px] pb-8 overflow-y-auto h-full">
          <div className="mx-auto h-2 w-[100px] rounded-full bg-gray-200 my-3" />
          <div className="px-6">
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-white pt-2">
              <h2 className="text-xl font-semibold">Edit Transaction</h2>
              <Button 
                onClick={() => onOpenChange(false)}
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full p-2 hover:bg-red-100 text-red-500 hover:text-red-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
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