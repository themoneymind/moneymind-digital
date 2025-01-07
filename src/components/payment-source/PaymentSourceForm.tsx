import { useState } from "react";
import { PaymentSourceTypeSelector } from "./PaymentSourceTypeSelector";
import { CreditCardForm } from "./CreditCardForm";
import { UpiAppsSelector } from "./UpiAppsSelector";
import { BankSelectionDialog } from "./BankSelectionDialog";
import { Input } from "@/components/ui/input";

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
          <BankSelectionDialog
            selectedBank={selectedBank}
            onBankSelect={onBankSelect}
            showBankSearch={showBankSearch}
            setShowBankSearch={setShowBankSearch}
            banks={INDIAN_BANKS}
          />

          {selectedBank && (
            <div className="space-y-4">
              <UpiAppsSelector
                selectedUpiApps={selectedUpiApps}
                onUpiToggle={onUpiToggle}
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