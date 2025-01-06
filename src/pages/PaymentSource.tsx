import { useNavigate } from "react-router-dom";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentSourceHeader } from "@/components/payment-source/PaymentSourceHeader";
import { PaymentSourceForm } from "@/components/payment-source/PaymentSourceForm";
import { PaymentSourceButtons } from "@/components/payment-source/PaymentSourceButtons";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePaymentSourceForm } from "@/hooks/usePaymentSourceForm";

export const PaymentSource = () => {
  const { paymentSources } = useFinance();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    navigate("/app");
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
    <Sheet defaultOpen>
      <SheetContent
        side="bottom"
        className="h-[85vh] p-0 overflow-hidden rounded-t-[28px]"
        closeButton={false}
      >
        <div className="flex flex-col h-full">
          <div className="mx-auto h-1 w-[36px] rounded-full bg-gray-200 my-3 cursor-grab active:cursor-grabbing" />
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