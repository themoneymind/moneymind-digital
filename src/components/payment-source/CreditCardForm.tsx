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
        <Input
          placeholder="Enter your credit card name"
          value={customBankName}
          onChange={handleCustomNameChange}
          className="h-12 w-full py-2 px-0 text-sm bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:border-primary rounded-none placeholder:text-gray-400"
        />

        <Input
          placeholder="Enter last 4 digits"
          value={lastFourDigits}
          onChange={handleLastFourDigitsChange}
          maxLength={4}
          className="h-12 w-full py-2 px-0 text-sm bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:border-primary rounded-none placeholder:text-gray-400"
        />

        <Input
          placeholder="Enter credit limit"
          value={creditLimit}
          onChange={handleCreditLimitChange}
          className="h-12 w-full py-2 px-0 text-sm bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:border-primary rounded-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};