import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentSourceHeader } from "@/components/payment-source/PaymentSourceHeader";
import { PaymentSourceForm } from "@/components/payment-source/PaymentSourceForm";
import { PaymentSourceButtons } from "@/components/payment-source/PaymentSourceButtons";

export const PaymentSource = () => {
  const { addPaymentSource, paymentSources } = useFinance();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedType, setSelectedType] = useState<"bank" | "credit">("bank");
  const [selectedBank, setSelectedBank] = useState("");
  const [customBankName, setCustomBankName] = useState("");
  const [customUpi, setCustomUpi] = useState("");
  const [selectedUpiApps, setSelectedUpiApps] = useState<string[]>([]);
  const [showBankSearch, setShowBankSearch] = useState(false);

  const handleTypeChange = (type: "bank" | "credit") => {
    setSelectedType(type);
    setSelectedBank("");
    setCustomBankName("");
  };

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
    setShowBankSearch(false);
  };

  const handleUpiToggle = (upiApp: string) => {
    setSelectedUpiApps((prev) =>
      prev.includes(upiApp)
        ? prev.filter((app) => app !== upiApp)
        : [...prev, upiApp]
    );
  };

  const checkDuplicateSource = (sourceName: string) => {
    return paymentSources.some(source => source.name === sourceName);
  };

  const handleAddSource = async () => {
    const bankName = selectedBank || customBankName;
    
    if (!bankName) {
      toast({
        title: "Error",
        description: "Please select or enter a bank name",
        variant: "destructive",
      });
      return;
    }

    const sourceName = selectedType === "credit" 
      ? `${bankName} Credit Card`
      : bankName;

    if (checkDuplicateSource(sourceName)) {
      toast({
        title: "Error",
        description: "The selected payment source has already been added",
        variant: "destructive",
      });
      return;
    }

    try {
      const newSource = {
        name: sourceName,
        type: selectedType === "bank" ? "Bank" : "Credit Card",
        amount: 0,
        linked: selectedUpiApps.length > 0,
        upi_apps: selectedUpiApps.length > 0 ? selectedUpiApps : undefined,
      };

      await addPaymentSource(newSource);

      toast({
        title: "Success",
        description: "Payment source added successfully",
      });

      setSelectedBank("");
      setCustomBankName("");
      setCustomUpi("");
      setSelectedUpiApps([]);
    } catch (error) {
      console.error("Error adding payment source:", error);
      toast({
        title: "Error",
        description: "Failed to add payment source",
        variant: "destructive",
      });
    }
  };

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

  return (
    <div className="min-h-screen bg-background p-6 overflow-y-auto">
      <div className="space-y-6 max-w-md mx-auto pb-20">
        <PaymentSourceHeader />
        
        <PaymentSourceForm
          selectedType={selectedType}
          selectedBank={selectedBank}
          customBankName={customBankName}
          customUpi={customUpi}
          selectedUpiApps={selectedUpiApps}
          onTypeChange={handleTypeChange}
          onBankSelect={handleBankSelect}
          setCustomBankName={setCustomBankName}
          setCustomUpi={setCustomUpi}
          onUpiToggle={handleUpiToggle}
          showBankSearch={showBankSearch}
          setShowBankSearch={setShowBankSearch}
        />

        <PaymentSourceButtons
          onAddSource={handleAddSource}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};