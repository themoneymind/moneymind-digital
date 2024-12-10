import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentSourceTypeSelector } from "@/components/payment-source/PaymentSourceTypeSelector";
import { UpiAppsSelector } from "@/components/payment-source/UpiAppsSelector";
import { BankSelectionDialog } from "@/components/payment-source/BankSelectionDialog";
import { CreditCardForm } from "@/components/payment-source/CreditCardForm";

const INDIAN_BANKS = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Yes Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "IndusInd Bank",
];

export const PaymentSource = () => {
  const { addPaymentSource } = useFinance();
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
    // Reset selections when switching types
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

    try {
      const sourceName = selectedType === "credit" 
        ? `${bankName} Credit Card`
        : bankName;

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

      // Reset form after successful addition
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
    localStorage.removeItem("isFirstTimeUser");
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-background p-6 overflow-y-auto">
      <div className="space-y-6 max-w-md mx-auto pb-20">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Add Payment Source</h1>
          <p className="text-sm text-muted-foreground">
            Add all your bank accounts, UPIs, and credit cards (these are reference sources to manage your expenses, not linked to actual bank accounts)
          </p>
        </div>

        <PaymentSourceTypeSelector
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
        />

        {selectedType === "bank" && (
          <div className="space-y-4">
            <BankSelectionDialog
              selectedBank={selectedBank}
              onBankSelect={handleBankSelect}
              showBankSearch={showBankSearch}
              setShowBankSearch={setShowBankSearch}
              banks={INDIAN_BANKS}
            />

            {selectedBank && (
              <div className="space-y-4">
                <UpiAppsSelector
                  selectedUpiApps={selectedUpiApps}
                  onUpiToggle={handleUpiToggle}
                />

                <div className="space-y-2">
                  <h3 className="font-medium">Add Custom UPI App</h3>
                  <Input
                    placeholder="Enter UPI app name"
                    value={customUpi}
                    onChange={(e) => setCustomUpi(e.target.value)}
                    className="h-14 rounded-[12px] bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {selectedType === "credit" && (
          <CreditCardForm
            selectedBank={selectedBank}
            onBankSelect={handleBankSelect}
            showBankSearch={showBankSearch}
            setShowBankSearch={setShowBankSearch}
            banks={INDIAN_BANKS}
            customBankName={customBankName}
            setCustomBankName={setCustomBankName}
          />
        )}

        <Button
          className="w-full h-14 rounded-[12px]"
          onClick={handleAddSource}
          disabled={!selectedBank && !customBankName}
        >
          Add Payment Source
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          After adding payment sources, click 'Complete' to proceed
        </p>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t">
          <Button
            className="w-full h-14 rounded-[12px]"
            onClick={handleComplete}
          >
            Complete
          </Button>
        </div>
      </div>
    </div>
  );
};