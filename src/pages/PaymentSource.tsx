import { useNavigate } from "react-router-dom";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentSourceHeader } from "@/components/payment-source/PaymentSourceHeader";
import { PaymentSourceForm } from "@/components/payment-source/PaymentSourceForm";
import { PaymentSourceButtons } from "@/components/payment-source/PaymentSourceButtons";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { usePaymentSourceForm } from "@/hooks/usePaymentSourceForm";
import { useState, useRef, useCallback } from "react";
import { useDialogState } from "@/hooks/useDialogState";

export const PaymentSource = () => {
  const { paymentSources } = useFinance();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const dragStartY = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const animationTimeout = useRef<NodeJS.Timeout>();

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Wait for the animation to complete before navigating
    animationTimeout.current = setTimeout(() => {
      navigate("/app");
    }, 300); // Match this with the animation duration in sheet.tsx
  }, [navigate]);

  const { isClosing, handleOpenChange } = useDialogState((open) => {
    if (!open) {
      handleClose();
    }
  });

  const handleComplete = () => {
    if (paymentSources.length === 0) {
      toast({
        title: "Error",
        description: "Add payment source to complete",
        variant: "destructive",
      });
      return;
    }
    localStorage.removeItem("isFirstTimeUser");
    handleClose();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartY.current || !sheetRef.current) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - dragStartY.current;

    if (deltaY > 100) { // Threshold for closing
      handleClose();
    }
  };

  const handleTouchEnd = () => {
    dragStartY.current = null;
  };

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
  } = usePaymentSourceForm(handleComplete);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] p-0 overflow-hidden rounded-t-[28px]"
        closeButton={false}
        ref={sheetRef}
      >
        <div className="flex flex-col h-full">
          <SheetClose asChild>
            <div 
              className="mx-auto h-1 w-[36px] rounded-full bg-gray-200 my-3 cursor-grab active:cursor-grabbing" 
              role="button"
              aria-label="Drag to close"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </SheetClose>
          <div className="px-6 flex-1 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">Add Payment Source</h2>
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

              <PaymentSourceButtons
                onAddSource={handleAddSource}
                onComplete={handleComplete}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};