import { BankSelectionDialog } from "./BankSelectionDialog";

interface BankSectionProps {
  selectedBank: string;
  onBankSelect: (bank: string) => void;
  showBankSearch: boolean;
  setShowBankSearch: (show: boolean) => void;
  banks: string[];
}

export const BankSection = ({
  selectedBank,
  onBankSelect,
  showBankSearch,
  setShowBankSearch,
  banks,
}: BankSectionProps) => {
  return (
    <BankSelectionDialog
      selectedBank={selectedBank}
      onBankSelect={onBankSelect}
      showBankSearch={showBankSearch}
      setShowBankSearch={setShowBankSearch}
      banks={banks}
    />
  );
};