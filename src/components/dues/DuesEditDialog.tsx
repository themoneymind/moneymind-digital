import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DueTransaction } from "@/types/dues";
import { useState } from "react";
import { PaymentSourceSelector } from "../transaction/PaymentSourceSelector";
import { useFinance } from "@/contexts/FinanceContext";

type DuesEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: DueTransaction;
  onSave: (updates: Partial<DueTransaction>) => Promise<void>;
};

export const DuesEditDialog = ({
  open,
  onOpenChange,
  transaction,
  onSave,
}: DuesEditDialogProps) => {
  const { getFormattedPaymentSources } = useFinance();
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [personName, setPersonName] = useState(transaction.description?.replace(/^Due (Given to|Received from): /, '') || '');
  const [repaymentDate, setRepaymentDate] = useState<Date | undefined>(
    transaction.repayment_date ? new Date(transaction.repayment_date) : undefined
  );
  const [source, setSource] = useState(transaction.source);
  const [description, setDescription] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedSources = getFormattedPaymentSources();

  const handleSubmit = async () => {
    if (!amount || !personName || !source || !repaymentDate) {
      return;
    }

    setIsSubmitting(true);
    try {
      const dueDescription = `Due ${transaction.type === "expense" ? "Given to" : "Received from"}: ${personName}`;
      const updates = {
        amount: Number(amount),
        source,
        description: dueDescription,
        repayment_date: repaymentDate.toISOString(),
        remaining_balance: Number(amount),
        next_reminder_date: repaymentDate.toISOString(),
      };

      await onSave(updates);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating due:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Due Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <Input
              type="number"
              placeholder="0"
              className="text-2xl pl-8 h-14 border-gray-200 rounded-[12px]"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Input
            placeholder="Person/Group Name"
            className="h-14 border-gray-200 rounded-[12px] md:text-sm text-base"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-14 justify-start text-left font-normal border-gray-200 rounded-[12px] md:text-sm text-base",
                  !repaymentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {repaymentDate ? format(repaymentDate, "PPP") : "Select repayment date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={repaymentDate}
                onSelect={setRepaymentDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>

          <PaymentSourceSelector
            source={source}
            onSourceChange={setSource}
            formattedSources={formattedSources}
          />

          <Input
            placeholder="UPI ID or Phone Number"
            className="h-14 border-gray-200 rounded-[12px] md:text-sm text-base"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />

          <Input
            placeholder="Description (Optional)"
            className="h-14 border-gray-200 rounded-[12px] md:text-sm text-base"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-[12px] md:text-sm text-base"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};