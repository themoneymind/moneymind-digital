import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PaymentSourceDialogHeaderProps {
  onClose: () => void;
}

export const PaymentSourceDialogHeader = ({ onClose }: PaymentSourceDialogHeaderProps) => {
  return (
    <DialogHeader className="flex flex-row items-center justify-between">
      <DialogTitle className="text-lg">Edit Payment Source</DialogTitle>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </DialogHeader>
  );
};