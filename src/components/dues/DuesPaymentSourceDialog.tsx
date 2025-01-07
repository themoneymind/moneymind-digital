import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentSourceSelector } from "../transaction/PaymentSourceSelector";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";

type DuesPaymentSourceDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sourceId: string) => void;
  title: string;
};

export const DuesPaymentSourceDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}: DuesPaymentSourceDialogProps) => {
  const { getFormattedPaymentSources } = useFinance();
  const [selectedSource, setSelectedSource] = useState("");
  const formattedSources = getFormattedPaymentSources();

  const handleConfirm = () => {
    if (selectedSource) {
      onConfirm(selectedSource);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <PaymentSourceSelector
            source={selectedSource}
            onSourceChange={setSelectedSource}
            formattedSources={formattedSources}
          />
          <Button 
            className="w-full"
            onClick={handleConfirm}
            disabled={!selectedSource}
          >
            Confirm Payment Source
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};