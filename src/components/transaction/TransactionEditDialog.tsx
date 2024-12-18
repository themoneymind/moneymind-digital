import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useFinance } from "@/contexts/FinanceContext";
import { Transaction } from "@/types/transactions";
import { useToast } from "@/hooks/use-toast";
import { useTransactionEditForm } from "@/hooks/useTransactionEditForm";
import { TransactionEditDialogContent } from "./TransactionEditDialogContent";

type TransactionEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
};

export const TransactionEditDialog = ({
  open,
  onOpenChange,
  transaction,
}: TransactionEditDialogProps) => {
  const { getFormattedPaymentSources } = useFinance();
  const { toast } = useToast();
  const formattedSources = getFormattedPaymentSources();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    operation,
    setOperation,
    amount,
    setAmount,
    selectedSource,
    setSelectedSource,
    description,
    setDescription,
    handleSubmit: onSubmit,
    resetForm,
  } = useTransactionEditForm(transaction, () => {
    console.log("Transaction edit success callback");
    toast({
      title: "Success",
      description: "Transaction updated successfully",
    });
    handleClose();
  });

  useEffect(() => {
    console.log("Dialog open state changed:", open);
    console.log("Current dropdown state:", isDropdownOpen);
    if (open) {
      resetForm();
      setIsSubmitting(false);
      setIsDropdownOpen(false);
    }
  }, [open, resetForm]);

  const handleClose = () => {
    console.log("Attempting to close dialog");
    console.log("isSubmitting:", isSubmitting);
    console.log("isDropdownOpen:", isDropdownOpen);
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update transaction",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        console.log("Dialog onOpenChange triggered");
        console.log("newOpen:", newOpen);
        console.log("isSubmitting:", isSubmitting);
        console.log("isDropdownOpen:", isDropdownOpen);
        if (!newOpen && !isSubmitting && !isDropdownOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => {
          console.log("Pointer down outside");
          console.log("isSubmitting:", isSubmitting);
          console.log("isDropdownOpen:", isDropdownOpen);
          if (isSubmitting || isDropdownOpen) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          console.log("Escape key pressed");
          console.log("isSubmitting:", isSubmitting);
          console.log("isDropdownOpen:", isDropdownOpen);
          if (isSubmitting || isDropdownOpen) {
            e.preventDefault();
            if (isDropdownOpen) {
              setIsDropdownOpen(false);
            }
          }
        }}
      >
        <TransactionEditDialogContent
          transaction={transaction}
          operation={operation}
          setOperation={setOperation}
          amount={amount}
          setAmount={setAmount}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          description={description}
          setDescription={setDescription}
          formattedSources={formattedSources}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onDropdownOpenChange={setIsDropdownOpen}
        />
      </DialogContent>
    </Dialog>
  );
};