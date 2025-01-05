import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  lastFourDigits: string;
  setLastFourDigits: (digits: string) => void;
  creditLimit: string;
  setCreditLimit: (limit: string) => void;
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
  lastFourDigits,
  setLastFourDigits,
  creditLimit,
  setCreditLimit,
}: PaymentSourceFormProps) => {
  return (
    <div className="space-y-4">
      <Tabs
        defaultValue={selectedType}
        onValueChange={(value) => onTypeChange(value as "bank" | "credit")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-[#F1F1F1] rounded-full mx-4">
          <TabsTrigger
            value="bank"
            className={`h-12 text-sm font-medium transition-all duration-200 rounded-full data-[state=active]:shadow-sm ${
              selectedType === "bank"
                ? "data-[state=active]:bg-[#7F3DFF] data-[state=active]:text-white"
                : "text-gray-600 hover:text-[#7F3DFF]"
            }`}
          >
            Bank Account
          </TabsTrigger>
          <TabsTrigger
            value="credit"
            className={`h-12 text-sm font-medium transition-all duration-200 rounded-full data-[state=active]:shadow-sm ${
              selectedType === "credit"
                ? "data-[state=active]:bg-[#7F3DFF] data-[state=active]:text-white"
                : "text-gray-600 hover:text-[#7F3DFF]"
            }`}
          >
            Credit Card
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bank" className="mt-6">
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
        </TabsContent>

        <TabsContent value="credit" className="mt-6">
          <CreditCardForm
            selectedBank={selectedBank}
            onBankSelect={onBankSelect}
            showBankSearch={showBankSearch}
            setShowBankSearch={setShowBankSearch}
            banks={INDIAN_BANKS}
            customBankName={customBankName}
            setCustomBankName={setCustomBankName}
            lastFourDigits={lastFourDigits}
            setLastFourDigits={setLastFourDigits}
            creditLimit={creditLimit}
            setCreditLimit={setCreditLimit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};