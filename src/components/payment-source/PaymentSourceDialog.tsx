import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePaymentSourceOperations } from "@/hooks/usePaymentSourceOperations";
import { PaymentSourceDialogForm } from "./PaymentSourceDialogForm";

type PaymentSourceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: {
    id: string;
    name: string;
    type: string;
    amount: number;
    linked?: boolean;
    upi_apps?: string[];
  };
  onDelete?: () => void;
};

export const PaymentSourceDialog = ({
  open,
  onOpenChange,
  source,
  onDelete,
}: PaymentSourceDialogProps) => {
  const [name, setName] = useState("");
  const [selectedUpiApps, setSelectedUpiApps] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetState = useCallback(() => {
    setName(source?.name || "");
    setSelectedUpiApps(source?.upi_apps || []);
    setIsSubmitting(false);
  }, [source]);

  useEffect(() => {
    if (open) {
      resetState();
    }
  }, [open, resetState]);

  const { handleNameAndUpiChange } = usePaymentSourceOperations(source, () => {
    onOpenChange(false);
  });

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await handleNameAndUpiChange(name, selectedUpiApps);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      setIsSubmitting(true);
      try {
        await onDelete();
        onOpenChange(false);
      } catch (error) {
        console.error("Error deleting payment source:", error);
        toast({
          title: "Error",
          description: "Failed to delete payment source",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <PaymentSourceDialogForm
          name={name}
          setName={setName}
          selectedUpiApps={selectedUpiApps}
          setSelectedUpiApps={setSelectedUpiApps}
          sourceType={source?.type}
          onSave={handleSave}
          onDelete={handleDelete}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};