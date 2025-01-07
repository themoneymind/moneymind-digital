import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { PaymentSourceDialogContent } from "./PaymentSourceDialogContent";
import { PaymentSourceDialogHeader } from "./PaymentSourceDialogHeader";
import { PaymentSourceDialogActions } from "./PaymentSourceDialogActions";
import { usePaymentSourceOperations } from "@/hooks/usePaymentSourceOperations";
import { useToast } from "@/hooks/use-toast";
import { useDialogState } from "@/hooks/useDialogState";

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
  const [customUpi, setCustomUpi] = useState("");
  const { toast } = useToast();
  const dialogState = useDialogState(onOpenChange);

  const resetState = useCallback(() => {
    setName(source?.name || "");
    setSelectedUpiApps(source?.upi_apps || []);
    setCustomUpi("");
    dialogState.reset();
  }, [source]);

  useEffect(() => {
    if (open) {
      resetState();
    }
  }, [open, resetState]);

  const { handleNameAndUpiChange } = usePaymentSourceOperations(
    source,
    () => {
      dialogState.initiateClose();
      onOpenChange(false);
    }
  );

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid name",
        variant: "destructive",
      });
      return;
    }

    const allUpiApps = [...selectedUpiApps];
    if (customUpi.trim()) {
      allUpiApps.push(customUpi.trim());
    }

    try {
      await handleNameAndUpiChange(name, allUpiApps);
      toast({
        title: "Success",
        description: "Payment source updated successfully",
      });
    } catch (error) {
      console.error("Error updating payment source:", error);
      toast({
        title: "Error",
        description: "Failed to update payment source",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      try {
        await onDelete();
        dialogState.initiateClose();
        onOpenChange(false);
      } catch (error) {
        console.error("Error deleting payment source:", error);
        toast({
          title: "Error",
          description: "Failed to delete payment source",
          variant: "destructive",
        });
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      dialogState.initiateClose();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]" 
        onPointerDownOutside={(e) => {
          if (dialogState.isSubmitting) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (dialogState.isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <PaymentSourceDialogHeader onClose={() => handleOpenChange(false)} />
        <PaymentSourceDialogContent
          name={name}
          setName={setName}
          selectedUpiApps={selectedUpiApps}
          setSelectedUpiApps={setSelectedUpiApps}
          sourceType={source?.type}
          customUpi={customUpi}
          onCustomUpiChange={setCustomUpi}
        />
        <PaymentSourceDialogActions
          onSave={handleSave}
          onDelete={handleDelete}
          isSubmitting={dialogState.isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};