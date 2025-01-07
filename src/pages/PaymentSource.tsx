import { useNavigate } from "react-router-dom";
import { useFinance } from "@/contexts/FinanceContext";
import { PaymentSourceHeader } from "@/components/payment-source/PaymentSourceHeader";
import { PaymentSourceForm } from "@/components/payment-source/PaymentSourceForm";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { usePaymentSourceForm } from "@/hooks/usePaymentSourceForm";
import { useState, useRef, useCallback } from "react";
import { useDialogState } from "@/hooks/useDialogState";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const PaymentSource = () => {
  const { paymentSources } = useFinance();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const dragStartY = useRef<number | null>(null);
  const currentDragY = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const animationTimeout = useRef<NodeJS.Timeout>();
  const isDragging = useRef(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Wait for the animation to complete before navigating
    animationTimeout.current = setTimeout(() => {
      navigate("/app");
    }, 300); // Match this with the animation duration in sheet.tsx
  }, [navigate]);

  const { handleOpenChange } = useDialogState((open) => {
    if (!open) {
      handleClose();
    }
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    currentDragY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartY.current || !sheetRef.current || !isDragging.current) return;

    currentDragY.current = e.touches[0].clientY;
    const deltaY = currentDragY.current - dragStartY.current;

    // Apply transform to follow finger movement
    if (deltaY > 0) { // Only allow dragging downwards
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!dragStartY.current || !currentDragY.current || !sheetRef.current) return;

    const deltaY = currentDragY.current - dragStartY.current;
    
    // Reset the transform
    sheetRef.current.style.transform = '';
    
    if (deltaY > 100) { // Threshold for closing
      handleClose();
    }

    // Reset refs
    dragStartY.current = null;
    currentDragY.current = null;
    isDragging.current = false;
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
  } = usePaymentSourceForm(() => {
    // Don't close the sheet after adding a source
    // This prevents the default closing behavior
  });

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] p-0 overflow-hidden rounded-t-[28px]"
        closeButton={false}
        ref={sheetRef}
      >
        <div className="flex flex-col h-full">
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
                className="h-8 w-8 rounded-full"
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