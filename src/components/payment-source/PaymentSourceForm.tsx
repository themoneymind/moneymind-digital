import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCardForm } from "./CreditCardForm";
import { BankSection } from "./BankSection";
import { UpiSection } from "./UpiSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const INDIAN_BANKS = [
  // Public Sector Banks (PSBs)
  "State Bank of India (SBI)",
  "Punjab National Bank (PNB)",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "Indian Bank",
  "Central Bank of India",
  "UCO Bank",
  "Bank of Maharashtra",
  "Punjab & Sind Bank",
  // Private Sector Banks
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "IndusInd Bank",
  "Yes Bank",
  "IDFC FIRST Bank",
  "Federal Bank",
  "South Indian Bank",
  "RBL Bank (Ratnakar Bank Limited)",
  // Foreign Banks Operating in India
  "Citibank",
  "Standard Chartered Bank",
  "HSBC",
  "Deutsche Bank",
  "Barclays Bank",
  "JPMorgan Chase Bank",
  "Bank of America",
  "DBS Bank",
  "Abu Dhabi Commercial Bank",
  "Qatar National Bank",
  // Regional Rural Banks (RRBs)
  "Prathama Bank",
  "Baroda UP Bank",
  "Andhra Pradesh Grameena Vikas Bank",
  "Bihar Gramin Bank",
  "Kerala Gramin Bank",
  // Cooperative Banks
  "Saraswat Cooperative Bank",
  "Cosmos Cooperative Bank",
  "Shamrao Vithal Cooperative Bank",
  "Kalupur Commercial Cooperative Bank",
  "Abhyudaya Cooperative Bank",
  // Small Finance Banks
  "AU Small Finance Bank",
  "Equitas Small Finance Bank",
  "Ujjivan Small Finance Bank",
  "Suryoday Small Finance Bank",
  "ESAF Small Finance Bank",
  // Payments Banks
  "Airtel Payments Bank",
  "India Post Payments Bank",
  "Fino Payments Bank",
  "Jio Payments Bank",
  "NSDL Payments Bank"
];

interface PaymentSourceFormProps {
  selectedType: "bank" | "credit";
  selectedBank: string;
  customBankName: string;
  customUpi: string;
  selectedUpiApps: string[];
  currentBalance: string;
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
  setCurrentBalance: (balance: string) => void;
}

export const PaymentSourceForm = ({
  selectedType,
  selectedBank,
  customBankName,
  customUpi,
  selectedUpiApps,
  currentBalance,
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
  setCurrentBalance,
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
              <>
                <UpiSection
                  selectedBank={selectedBank}
                  customUpi={customUpi}
                  selectedUpiApps={selectedUpiApps}
                  onUpiToggle={onUpiToggle}
                  onCustomUpiChange={setCustomUpi}
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    id="currentBalance"
                    type="number"
                    placeholder="Enter Current Balance (Optional)"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(e.target.value)}
                    className="pl-8 h-12 border-t-0 border-x-0 rounded-none text-base placeholder:text-gray-400 focus:border-[#7F3DFF] transition-colors"
                  />
                </div>
              </>
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
