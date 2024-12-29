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
  showPartialDialog: boolean;
  setShowPartialDialog: (show: boolean) => void;
  showPaymentSourceDialog: boolean;
  setShowPaymentSourceDialog: (show: boolean) => void;
  showExcuseDialog: boolean;
  setShowExcuseDialog: (show: boolean) => void;
  partialAmount: string;
  setPartialAmount: (amount: string) => void;
  excuseReason: string;
  setExcuseReason: (reason: string) => void;
  newRepaymentDate: Date | undefined;
  setNewRepaymentDate: (date: Date | undefined) => void;
  selectedTransaction: DueTransaction | null;
  setSelectedTransaction: (transaction: DueTransaction | null) => void;
  handleExcuseSubmit: () => Promise<void>;
  handlePaymentSourceSelect: (sourceId: string) => Promise<void>;
  handlePartialPaymentSourceSelect: (sourceId: string) => Promise<void>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
};

export const DuesDialogs = ({
  showPartialDialog,
  setShowPartialDialog,
  showPaymentSourceDialog,
  setShowPaymentSourceDialog,
  showExcuseDialog,
  setShowExcuseDialog,
  partialAmount,
  setPartialAmount,
  excuseReason,
  setExcuseReason,
  newRepaymentDate,
  setNewRepaymentDate,
  selectedTransaction,
  setSelectedTransaction,
  handleExcuseSubmit,
  handlePaymentSourceSelect,
  handlePartialPaymentSourceSelect,
  isDropdownOpen,
  setIsDropdownOpen,
}: DuesDialogsProps) => {
  return (
    <>
      <Dialog open={showPartialDialog} onOpenChange={setShowPartialDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <Button 
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-[12px]"
              onClick={() => {
                if (selectedTransaction) {
                  setShowPartialDialog(false);
                  setShowPaymentSourceDialog(true);
                }
              }}
            >
              Full Payment
            </Button>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <Input
                type="number"
                placeholder="Enter partial amount"
                className="text-2xl pl-8 h-14 border-gray-200 rounded-[12px]"
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
              />
            </div>
            <Button 
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-[12px]"
              onClick={() => {
                if (selectedTransaction && partialAmount) {
                  setShowPaymentSourceDialog(true);
                }
              }}
              disabled={!partialAmount}
            >
              Make Partial Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DuesPaymentSourceDialog
        isOpen={showPaymentSourceDialog}
        onClose={() => {
          setShowPaymentSourceDialog(false);
          setShowPartialDialog(false);
          setSelectedTransaction(null);
        }}
        onConfirm={partialAmount ? handlePartialPaymentSourceSelect : handlePaymentSourceSelect}
        title={`Select ${selectedTransaction?.type === 'expense' ? 'Repayment' : 'Payment'} Source`}
      />

      <Dialog open={showExcuseDialog} onOpenChange={setShowExcuseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <Input
              placeholder="Reason for rescheduling"
              value={excuseReason}
              onChange={(e) => setExcuseReason(e.target.value)}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newRepaymentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newRepaymentDate ? format(newRepaymentDate, "PPP") : "Select new date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newRepaymentDate}
                  onSelect={setNewRepaymentDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <Button 
              className="w-full"
              onClick={handleExcuseSubmit}
            >
              Confirm Reschedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};