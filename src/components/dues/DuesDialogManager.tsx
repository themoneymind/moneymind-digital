import { DueTransaction } from "@/types/dues";
import { DuesDialogs } from "./DuesDialogs";
import { DuesEditDialog } from "./DuesEditDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

type DuesDialogManagerProps = {
  selectedTransaction: DueTransaction;
  dialogStates: any;
  handlers: any;
};

export const DuesDialogManager = ({
  selectedTransaction,
  dialogStates,
  handlers,
}: DuesDialogManagerProps) => {
  return (
    <>
      <DuesDialogs
        showPartialDialog={dialogStates.showPartialDialog}
        setShowPartialDialog={dialogStates.setShowPartialDialog}
        showPaymentSourceDialog={dialogStates.showPaymentSourceDialog}
        setShowPaymentSourceDialog={dialogStates.setShowPaymentSourceDialog}
        showExcuseDialog={dialogStates.showExcuseDialog}
        setShowExcuseDialog={dialogStates.setShowExcuseDialog}
        partialAmount={dialogStates.partialAmount}
        setPartialAmount={dialogStates.setPartialAmount}
        excuseReason={dialogStates.excuseReason}
        setExcuseReason={dialogStates.setExcuseReason}
        newRepaymentDate={dialogStates.newRepaymentDate}
        setNewRepaymentDate={dialogStates.setNewRepaymentDate}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={() => null}
        handleExcuseSubmit={handlers.handleExcuseSubmit}
        handlePaymentSourceSelect={handlers.handlePaymentSourceSelect}
        handlePartialPaymentSourceSelect={handlers.handlePartialPaymentSourceSelect}
        isDropdownOpen={dialogStates.isDropdownOpen}
        setIsDropdownOpen={dialogStates.setIsDropdownOpen}
      />

      <DuesEditDialog
        open={dialogStates.showEditDialog}
        onOpenChange={dialogStates.setShowEditDialog}
        transaction={selectedTransaction}
        onSave={handlers.handleEditSave}
      />

      <DeleteConfirmationDialog
        isOpen={dialogStates.showDeleteDialog}
        onClose={() => {
          dialogStates.setShowDeleteDialog(false);
        }}
        onConfirm={handlers.handleConfirmDelete}
        amount={selectedTransaction?.amount || 0}
      />
    </>
  );
};