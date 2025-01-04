import { Input } from "@/components/ui/input";
import { BankSelectionDialog } from "./BankSelectionDialog";
import { Label } from "@/components/ui/label";

interface CreditCardFormProps {
  selectedBank: string;
  onBankSelect: (bank: string) => void;
  showBankSearch: boolean;
  setShowBankSearch: (show: boolean) => void;
  banks: string[];
  customBankName: string;
  setCustomBankName: (name: string) => void;
  lastFourDigits: string;
  setLastFourDigits: (digits: string) => void;
  creditLimit: string;
  setCreditLimit: (limit: string) => void;
}

export const CreditCardForm = ({
  selectedBank,
  onBankSelect,
  showBankSearch,
  setShowBankSearch,
  banks,
  customBankName,
  setCustomBankName,
  lastFourDigits,
  setLastFourDigits,
  creditLimit,
  setCreditLimit,
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

  const handleLastFourDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setLastFourDigits(value);
  };

  const handleCreditLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCreditLimit(value);
  };

  return (
    <div className="space-y-6">
      <BankSelectionDialog
        selectedBank={selectedBank}
        onBankSelect={handleBankSelection}
        showBankSearch={showBankSearch}
        setShowBankSearch={setShowBankSearch}
        banks={banks}
      />
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardName">Card Name</Label>
          <Input
            id="cardName"
            placeholder="Enter your credit card name"
            value={customBankName}
            onChange={handleCustomNameChange}
            className="h-14 rounded-[12px] bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastFourDigits">Last 4 Digits</Label>
          <Input
            id="lastFourDigits"
            placeholder="Enter last 4 digits"
            value={lastFourDigits}
            onChange={handleLastFourDigitsChange}
            maxLength={4}
            className="h-14 rounded-[12px] bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="creditLimit">Credit Limit</Label>
          <Input
            id="creditLimit"
            placeholder="Enter credit limit"
            value={creditLimit}
            onChange={handleCreditLimitChange}
            className="h-14 rounded-[12px] bg-white"
          />
        </div>
      </div>
    </div>
  );
};