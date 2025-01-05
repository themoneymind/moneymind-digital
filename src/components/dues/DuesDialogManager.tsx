import { DueTransaction } from "@/types/dues";
import { DuesDialogs } from "./DuesDialogs";
import { DuesEditDialog } from "./DuesEditDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface DuesDialogManagerProps {
  dialogState: ReturnType<typeof useDuesDialogState>;
  partialAmount: string;
  setPartialAmount: (amount: string) => void;
  excuseReason: string;
  setExcuseReason: (reason: string) => void;
  newRepaymentDate: Date | undefined;
  setNewRepaymentDate: (date: Date | undefined) => void;
  handleExcuseSubmit: () => Promise<void>;
  handlePaymentSourceSelect: (sourceId: string) => void;
  handlePartialPaymentSourceSelect: (sourceId: string) => void;
  handleEditSave: (updates: Partial<DueTransaction>) => Promise<void>;
}

export const DuesDialogManager = ({
  dialogState,
  partialAmount,
  setPartialAmount,
  excuseReason,
  setExcuseReason,
  newRepaymentDate,
  setNewRepaymentDate,
  handleExcuseSubmit,
  handlePaymentSourceSelect,
  handlePartialPaymentSourceSelect,
  handleEditSave,
}: DuesDialogManagerProps) => {
  const {
    showPartialDialog,
    setShowPartialDialog,
    showPaymentSourceDialog,
    setShowPaymentSourceDialog,
    showExcuseDialog,
    setShowExcuseDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    showEditDialog,
    setShowEditDialog,
    selectedTransaction,
    setSelectedTransaction,
    isDropdownOpen,
    setIsDropdownOpen,
  } = dialogState;

  return (
    <>
      <DuesDialogs
        showPartialDialog={showPartialDialog}
        setShowPartialDialog={setShowPartialDialog}
        showPaymentSourceDialog={showPaymentSourceDialog}
        setShowPaymentSourceDialog={setShowPaymentSourceDialog}
        showExcuseDialog={showExcuseDialog}
        setShowExcuseDialog={setShowExcuseDialog}
        partialAmount={partialAmount}
        setPartialAmount={setPartialAmount}
        excuseReason={excuseReason}
        setExcuseReason={setExcuseReason}
        newRepaymentDate={newRepaymentDate}
        setNewRepaymentDate={setNewRepaymentDate}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        handleExcuseSubmit={handleExcuseSubmit}
        handlePaymentSourceSelect={handlePaymentSourceSelect}
        handlePartialPaymentSourceSelect={handlePartialPaymentSourceSelect}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />

      {selectedTransaction && (
        <>
          <DuesEditDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            transaction={selectedTransaction}
            onSave={handleEditSave}
          />

          <DeleteConfirmationDialog
            isOpen={showDeleteDialog}
            onClose={() => {
              setShowDeleteDialog(false);
              setSelectedTransaction(null);
            }}
            onConfirm={() => {}}
            amount={selectedTransaction.amount}
          />
        </>
      )}
    </>
  );
};