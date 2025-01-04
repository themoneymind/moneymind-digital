import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentSourceHeader } from "@/components/payment-source/PaymentSourceHeader";
import { PaymentSourceForm } from "@/components/payment-source/PaymentSourceForm";
import { PaymentSourceButtons } from "@/components/payment-source/PaymentSourceButtons";
import { TopBar } from "@/components/TopBar";

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
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [creditLimit, setCreditLimit] = useState("");

  const handleTypeChange = (type: "bank" | "credit") => {
    setSelectedType(type);
    setSelectedBank("");
    setCustomBankName("");
    setLastFourDigits("");
    setCreditLimit("");
  };

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
    setShowBankSearch(false);
  };

  const formatSourceName = (bankName: string) => {
    const cleanName = bankName.replace(/\d+/g, '').trim();
    return cleanName.toLowerCase().includes('bank') ? cleanName : `${cleanName} Bank`;
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

    if (selectedType === "credit" && !creditLimit) {
      toast({
        title: "Error",
        description: "Please enter the credit limit",
        variant: "destructive",
      });
      return;
    }

    const sourceName = selectedType === "credit" 
      ? `${formatSourceName(bankName)} Credit Card`
      : formatSourceName(bankName);

    const checkDuplicateSource = (sourceName: string) => {
      return paymentSources.some(source => source.name === sourceName);
    };

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
        last_four_digits: lastFourDigits || undefined,
        credit_limit: selectedType === "credit" ? Number(creditLimit) : undefined,
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
      setLastFourDigits("");
      setCreditLimit("");
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
    <div className="min-h-screen bg-[#F5F5F7] relative overflow-hidden">
      <TopBar title="Add Payment Source" />
      
      {/* Decorative Circle */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#7F3DFF]/10 -mr-16 -mt-16" />
      
      <div className="p-6">
        <div className="space-y-6">
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
            onUpiToggle={(upiApp: string) => {
              setSelectedUpiApps((prev) =>
                prev.includes(upiApp)
                  ? prev.filter((app) => app !== upiApp)
                  : [...prev, upiApp]
              );
            }}
            showBankSearch={showBankSearch}
            setShowBankSearch={setShowBankSearch}
            lastFourDigits={lastFourDigits}
            setLastFourDigits={setLastFourDigits}
            creditLimit={creditLimit}
            setCreditLimit={setCreditLimit}
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