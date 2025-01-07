import { useNavigate } from "react-router-dom";
import { useFinance } from "@/contexts/FinanceContext";
import { PaymentSourceHeader } from "@/components/payment-source/PaymentSourceHeader";
import { PaymentSourceForm } from "@/components/payment-source/PaymentSourceForm";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { usePaymentSourceForm } from "@/hooks/usePaymentSourceForm";
import { useState, useRef } from "react";
import { useDialogState } from "@/hooks/useDialogState";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useDragToClose } from "@/hooks/useDragToClose";

export const PaymentSource = () => {
  const { paymentSources } = useFinance();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const animationTimeout = useRef<NodeJS.Timeout>();

  const handleCloseComplete = () => {
    setIsOpen(false);
    animationTimeout.current = setTimeout(() => {
      navigate("/app");
    }, 300);
  };

  const {
    sheetRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleClose,
  } = useDragToClose({
    onClose: handleCloseComplete,
  });

  const { handleOpenChange } = useDialogState((open) => {
    if (!open) {
      handleClose();
    }
  });

  const {
    selectedType,
    selectedBank,
    customBankName,
    customUpi,
    selectedUpiApps,
    showBankSearch,
    lastFourDigits,
    creditLimit,
    currentBalance,
    handleTypeChange,
    handleBankSelect,
    handleUpiToggle,
    handleAddSource,
    setCustomBankName,
    setCustomUpi,
    setShowBankSearch,
    setLastFourDigits,
    setCreditLimit,
    setCurrentBalance,
  } = usePaymentSourceForm(() => {
    // Don't close the sheet after adding a source
  });

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] p-0 bg-transparent border-none shadow-none"
        closeButton={false}
        ref={sheetRef}
      >
        <div className="flex flex-col h-full bg-background rounded-t-[28px] transition-transform duration-300">
          <div 
            className="mx-auto h-1 w-[36px] rounded-full bg-gray-200 my-3 cursor-grab active:cursor-grabbing" 
            role="button"
            aria-label="Drag to close"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          <div className="px-6 flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Add Payment Source</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-6">
              <PaymentSourceHeader />
              
              <PaymentSourceForm
                selectedType={selectedType}
                selectedBank={selectedBank}
                customBankName={customBankName}
                customUpi={customUpi}
                selectedUpiApps={selectedUpiApps}
                currentBalance={currentBalance}
                onTypeChange={handleTypeChange}
                onBankSelect={handleBankSelect}
                setCustomBankName={setCustomBankName}
                setCustomUpi={setCustomUpi}
                onUpiToggle={handleUpiToggle}
                showBankSearch={showBankSearch}
                setShowBankSearch={setShowBankSearch}
                lastFourDigits={lastFourDigits}
                setLastFourDigits={setLastFourDigits}
                creditLimit={creditLimit}
                setCreditLimit={setCreditLimit}
                setCurrentBalance={setCurrentBalance}
              />

              <Button
                className="w-full h-[52px] rounded-[16px] bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-medium"
                onClick={handleAddSource}
              >
                Add Payment Source
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};