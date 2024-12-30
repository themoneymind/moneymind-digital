import { Input } from "@/components/ui/input";
import { BankSelectionDialog } from "./BankSelectionDialog";

interface CreditCardFormProps {
  selectedBank: string;
  onBankSelect: (bank: string) => void;
  showBankSearch: boolean;
  setShowBankSearch: (show: boolean) => void;
  banks: string[];
  customBankName: string;
  setCustomBankName: (name: string) => void;
}

export const CreditCardForm = ({
  selectedBank,
  onBankSelect,
  showBankSearch,
  setShowBankSearch,
  banks,
  customBankName,
  setCustomBankName,
}: CreditCardFormProps) => {
  // Format the bank name to include "Bank" if not already present
  const formatBankName = (name: string) => {
    if (!name) return "";
    return name.toLowerCase().includes("bank") ? name : `${name} Bank`;
  };

  const handleCustomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBankName(formatBankName(e.target.value));
  };

  const handleBankSelection = (bank: string) => {
    onBankSelect(formatBankName(bank));
  };

  return (
    <div className="space-y-4">
      <BankSelectionDialog
        selectedBank={selectedBank}
        onBankSelect={handleBankSelection}
        showBankSearch={showBankSearch}
        setShowBankSearch={setShowBankSearch}
        banks={banks}
      />
      <Input
        placeholder="Enter your credit card name"
        value={customBankName}
        onChange={handleCustomNameChange}
        className="h-14 rounded-[12px] bg-white"
      />
    </div>
  );
};