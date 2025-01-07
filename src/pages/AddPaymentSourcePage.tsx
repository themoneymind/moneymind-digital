import { TopBar } from "@/components/TopBar";
import { PaymentSourceForm } from "@/components/payment-source/PaymentSourceForm";
import { PaymentSourceHeader } from "@/components/payment-source/PaymentSourceHeader";
import { PaymentSourceButtons } from "@/components/payment-source/PaymentSourceButtons";
import { usePaymentSourceForm } from "@/hooks/usePaymentSourceForm";
import { useNavigate } from "react-router-dom";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";

export const AddPaymentSourcePage = () => {
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
    <div className="min-h-screen bg-[#F5F5F7]">
      <TopBar title="Add Payment Source" />
      
      <div className="px-6 py-8">
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
  );
};