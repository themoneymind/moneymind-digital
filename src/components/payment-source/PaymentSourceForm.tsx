import { PaymentSourceTypeSelector } from "./PaymentSourceTypeSelector";
import { CreditCardForm } from "./CreditCardForm";
import { BankSection } from "./BankSection";
import { UpiSection } from "./UpiSection";

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

interface PaymentSourceFormProps {
  selectedType: "bank" | "credit";
  selectedBank: string;
  customBankName: string;
  customUpi: string;
  selectedUpiApps: string[];
  onTypeChange: (type: "bank" | "credit") => void;
  onBankSelect: (bank: string) => void;
  setCustomBankName: (name: string) => void;
  setCustomUpi: (upi: string) => void;
  onUpiToggle: (upiApp: string) => void;
  showBankSearch: boolean;
  setShowBankSearch: (show: boolean) => void;
}

export const PaymentSourceForm = ({
  selectedType,
  selectedBank,
  customBankName,
  customUpi,
  selectedUpiApps,
  onTypeChange,
  onBankSelect,
  setCustomBankName,
  setCustomUpi,
  onUpiToggle,
  showBankSearch,
  setShowBankSearch,
}: PaymentSourceFormProps) => {
  return (
    <div className="space-y-4">
      <PaymentSourceTypeSelector
        selectedType={selectedType}
        onTypeChange={onTypeChange}
      />

      {selectedType === "bank" && (
        <div className="space-y-4">
          <BankSection
            selectedBank={selectedBank}
            onBankSelect={onBankSelect}
            showBankSearch={showBankSearch}
            setShowBankSearch={setShowBankSearch}
            banks={INDIAN_BANKS}
          />

          {selectedBank && (
            <UpiSection
              selectedBank={selectedBank}
              customUpi={customUpi}
              selectedUpiApps={selectedUpiApps}
              onUpiToggle={onUpiToggle}
              onCustomUpiChange={setCustomUpi}
            />
          )}
        </div>
      )}

      {selectedType === "credit" && (
        <CreditCardForm
          selectedBank={selectedBank}
          onBankSelect={onBankSelect}
          showBankSearch={showBankSearch}
          setShowBankSearch={setShowBankSearch}
          banks={INDIAN_BANKS}
          customBankName={customBankName}
          setCustomBankName={setCustomBankName}
        />
      )}
    </div>
  );
};