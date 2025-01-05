import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCardForm } from "./CreditCardForm";
import { BankSection } from "./BankSection";
import { UpiSection } from "./UpiSection";

const INDIAN_BANKS = [
  // Major Banks
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "Bank of India",
  "Indian Bank",
  "Central Bank of India",
  "Indian Overseas Bank",
  "UCO Bank",
  "Bank of Maharashtra",
  "Punjab & Sind Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "IndusInd Bank",
  "Yes Bank",
  "IDBI Bank",
  "Federal Bank",
  // Small Finance Banks
  "AU Small Finance Bank",
  "Equitas Small Finance Bank",
  "Ujjivan Small Finance Bank",
  "Jana Small Finance Bank",
  "Suryoday Small Finance Bank",
  "ESAF Small Finance Bank",
  // Payments Banks
  "Airtel Payments Bank",
  "India Post Payments Bank",
  "Fino Payments Bank",
  "Jio Payments Bank",
  "NSDL Payments Bank",
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
        className="w-full max-w-md mx-auto"
      >
        <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-[#F1F1F1] rounded-full">
          <TabsTrigger
            value="bank"
            className={`h-9 text-sm font-medium transition-all duration-200 rounded-full data-[state=active]:shadow-sm ${
              selectedType === "bank"
                ? "data-[state=active]:bg-[#7F3DFF] data-[state=active]:text-white"
                : "text-gray-600 hover:text-[#7F3DFF]"
            }`}
          >
            Bank Account
          </TabsTrigger>
          <TabsTrigger
            value="credit"
            className={`h-9 text-sm font-medium transition-all duration-200 rounded-full data-[state=active]:shadow-sm ${
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