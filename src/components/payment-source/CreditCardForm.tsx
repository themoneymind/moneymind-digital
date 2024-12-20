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
  return (
    <div className="space-y-4">
      <BankSelectionDialog
        selectedBank={selectedBank}
        onBankSelect={onBankSelect}
        showBankSearch={showBankSearch}
        setShowBankSearch={setShowBankSearch}
        banks={banks}
      />
      <Input
        placeholder="Enter your credit card name"
        value={customBankName}
        onChange={(e) => setCustomBankName(e.target.value)}
        className="h-14 rounded-[12px] bg-white"
      />
    </div>
  );
};