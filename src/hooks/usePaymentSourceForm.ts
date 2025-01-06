import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { useToast } from "@/hooks/use-toast";

export const usePaymentSourceForm = (onSuccess: () => void) => {
  const { addPaymentSource, addTransaction, paymentSources } = useFinance();
  const { toast } = useToast();
  
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
    // If it's a credit card, handle it as before
    if (selectedType === "credit") {
      const nameWithoutSuffixes = bankName
        .replace(/\s*bank\s*/gi, '')
        .replace(/\s*credit\s*card\s*/gi, '')
        .trim();
      return `${nameWithoutSuffixes} Credit Card`;
    }
    
    // For bank accounts, only add "Bank" suffix if it's not already part of the name
    const cleanName = bankName.trim();
    if (!cleanName.toLowerCase().includes('bank')) {
      return `${cleanName} Bank`;
    }
    return cleanName;
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

    if (selectedType === "credit" && !creditLimit) {
      toast({
        title: "Error",
        description: "Please enter the credit limit",
        variant: "destructive",
      });
      return;
    }

    const sourceName = formatSourceName(bankName);

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
      
      if (result.error) throw result.error;
      
      if (result.data && currentBalance && Number(currentBalance) > 0) {
        await addTransaction({
          type: "income",
          amount: Number(currentBalance),
          category: "Initial Balance",
          source: result.data.id,
          description: `Initial balance for ${sourceName}`,
          date: new Date(),
          base_source_id: result.data.id,
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
      
      onSuccess();
    } catch (error) {
      console.error("Error adding payment source:", error);
      toast({
        title: "Error",
        description: "Failed to add payment source",
        variant: "destructive",
      });
    }
  };

  return {
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
  };
};