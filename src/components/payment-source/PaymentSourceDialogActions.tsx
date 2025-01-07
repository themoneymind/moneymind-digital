import { Button } from "@/components/ui/button";

interface PaymentSourceDialogActionsProps {
  onSave: () => void;
  onDelete?: () => void;
  isSubmitting: boolean;
}

export const PaymentSourceDialogActions = ({
  onSave,
  onDelete,
  isSubmitting,
}: PaymentSourceDialogActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={onSave} 
        className="flex-1 h-12 rounded-[12px]"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
      {onDelete && (
        <Button 
          onClick={onDelete}
          variant="destructive"
          className="flex-1 h-12 rounded-[12px] bg-red-600 hover:bg-red-700"
        >
          Delete
        </Button>
      )}
    </div>
  );
};