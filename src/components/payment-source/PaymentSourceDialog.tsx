import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { PaymentSourceDialogContent } from "./PaymentSourceDialogContent";
import { usePaymentSourceOperations } from "@/hooks/usePaymentSourceOperations";
import { useToast } from "@/hooks/use-toast";
import { useDialogState } from "@/hooks/useDialogState";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const { isSubmitting, handleNameAndUpiChange } = usePaymentSourceOperations(
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

    await handleNameAndUpiChange(name, allUpiApps);
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
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg">Edit Payment Source</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => handleOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <PaymentSourceDialogContent
          name={name}
          setName={setName}
          selectedUpiApps={selectedUpiApps}
          setSelectedUpiApps={setSelectedUpiApps}
          sourceType={source?.type}
          onSave={handleSave}
          onDelete={handleDelete}
          isSubmitting={dialogState.isSubmitting}
          customUpi={customUpi}
          onCustomUpiChange={setCustomUpi}
        />
      </DialogContent>
    </Dialog>
  );
};