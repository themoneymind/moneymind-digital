import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentSourceHeader } from "@/components/payment-source/PaymentSourceHeader";
import { PaymentSourceForm } from "@/components/payment-source/PaymentSourceForm";
import { PaymentSourceButtons } from "@/components/payment-source/PaymentSourceButtons";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export const PaymentSource = () => {
  const { addPaymentSource, addTransaction, paymentSources } = useFinance();
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
  const [currentBalance, setCurrentBalance] = useState("");

  const handleTypeChange = (type: "bank" | "credit") => {
    setSelectedType(type);
    setSelectedBank("");
    setCustomBankName("");
    setLastFourDigits("");
    setCreditLimit("");
    setCurrentBalance("");
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
      const newSourceData = {
        name: sourceName,
        type: selectedType === "bank" ? "Bank" : "Credit Card",
        amount: currentBalance ? Number(currentBalance) : 0,
        linked: selectedUpiApps.length > 0,
        upi_apps: selectedUpiApps.length > 0 ? selectedUpiApps : undefined,
        last_four_digits: lastFourDigits || undefined,
        credit_limit: selectedType === "credit" ? Number(creditLimit) : undefined,
      };

      const result = await addPaymentSource(newSourceData);
      const newSource = result.data;
      const error = result.error;
      
      if (error) throw error;
      
      if (newSource && currentBalance && Number(currentBalance) > 0) {
        await addTransaction({
          type: "income",
          amount: Number(currentBalance),
          category: "Initial Balance",
          source: newSource.id,
          description: `Initial balance for ${sourceName}`,
          date: new Date(),
          base_source_id: newSource.id,
          display_source: sourceName,
        });
      }

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
      setCurrentBalance("");
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
    <Sheet defaultOpen>
      <SheetContent
        side="bottom"
        className="h-[95vh] p-0 overflow-hidden"
        closeButton={false}
      >
        <div className="overflow-y-auto h-full">
          <div className="mx-auto h-1 w-[36px] rounded-full bg-gray-200 my-3" />
          <div className="px-6">
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