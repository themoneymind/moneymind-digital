import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DueTransaction } from "@/types/dues";
import { DuesPaymentSourceDialog } from "./DuesPaymentSourceDialog";

type DuesDialogsProps = {
  dialogState: {
    selectedTransaction: DueTransaction | null;
    showPartialDialog: boolean;
    showPaymentSourceDialog: boolean;
    partialAmount: string;
    excuseReason: string;
    showExcuseDialog: boolean;
    newRepaymentDate: Date | undefined;
    isDropdownOpen: boolean;
  };
  handlers: {
    setSelectedTransaction: (transaction: DueTransaction | null) => void;
    setShowPartialDialog: (show: boolean) => void;
    setShowPaymentSourceDialog: (show: boolean) => void;
    setPartialAmount: (amount: string) => void;
    setExcuseReason: (reason: string) => void;
    setShowExcuseDialog: (show: boolean) => void;
    setNewRepaymentDate: (date: Date | undefined) => void;
    setIsDropdownOpen: (open: boolean) => void;
  };
  onPaymentSourceSelect: (sourceId: string) => Promise<void>;
  onPartialPaymentSourceSelect: (sourceId: string) => Promise<void>;
  onExcuseSubmit: () => Promise<void>;
};

export const DuesDialogs = ({
  dialogState,
  handlers,
  onPaymentSourceSelect,
  onPartialPaymentSourceSelect,
  onExcuseSubmit,
}: DuesDialogsProps) => {
  return (
    <>
      <Dialog open={dialogState.showPartialDialog} onOpenChange={handlers.setShowPartialDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Partial Payment Amount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <Input
                type="number"
                placeholder="0"
                className="pl-8"
                value={dialogState.partialAmount}
                onChange={(e) => handlers.setPartialAmount(e.target.value)}
              />
            </div>
            <Button 
              className="w-full"
              onClick={() => {
                if (dialogState.selectedTransaction) {
                  handlers.setShowPaymentSourceDialog(true);
                }
              }}
              disabled={!dialogState.partialAmount}
            >
              Select Payment Source
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DuesPaymentSourceDialog
        isOpen={dialogState.showPaymentSourceDialog}
        onClose={() => {
          handlers.setShowPaymentSourceDialog(false);
          handlers.setShowPartialDialog(false);
          handlers.setSelectedTransaction(null);
        }}
        onConfirm={dialogState.partialAmount ? onPartialPaymentSourceSelect : onPaymentSourceSelect}
        title={`Select ${dialogState.selectedTransaction?.type === 'expense' ? 'Repayment' : 'Payment'} Source`}
      />

      <Dialog open={dialogState.showExcuseDialog} onOpenChange={handlers.setShowExcuseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <Input
              placeholder="Reason for rescheduling"
              value={dialogState.excuseReason}
              onChange={(e) => handlers.setExcuseReason(e.target.value)}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dialogState.newRepaymentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dialogState.newRepaymentDate ? format(dialogState.newRepaymentDate, "PPP") : "Select new date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dialogState.newRepaymentDate}
                  onSelect={handlers.setNewRepaymentDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <Button 
              className="w-full"
              onClick={onExcuseSubmit}
            >
              Confirm Reschedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};