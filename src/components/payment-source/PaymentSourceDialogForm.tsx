import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentSourceDialogContent } from "./PaymentSourceDialogContent";

type PaymentSourceDialogFormProps = {
  name: string;
  setName: (name: string) => void;
  selectedUpiApps: string[];
  setSelectedUpiApps: (apps: string[]) => void;
  sourceType?: string;
  onSave: () => void;
  onDelete?: () => void;
  isSubmitting: boolean;
};

export const PaymentSourceDialogForm = ({
  name,
  setName,
  selectedUpiApps,
  setSelectedUpiApps,
  sourceType,
  onSave,
  onDelete,
  isSubmitting,
}: PaymentSourceDialogFormProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg">Edit Payment Source</DialogTitle>
      </DialogHeader>
      <PaymentSourceDialogContent
        name={name}
        setName={setName}
        selectedUpiApps={selectedUpiApps}
        setSelectedUpiApps={setSelectedUpiApps}
        sourceType={sourceType}
        onSave={onSave}
        onDelete={onDelete}
        isSubmitting={isSubmitting}
      />
    </>
  );
};