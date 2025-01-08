import React from "react";
import { Input } from "@/components/ui/input";
import { BankSelectionDialog } from "./BankSelectionDialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
  const handleLastFourDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setLastFourDigits(value);
  };

  const handleCreditLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCreditLimit(value);
  };

  const handleCustomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBankName(e.target.value);
  };

  const [isCustomCard, setIsCustomCard] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="custom-card" className="text-sm font-medium">
          Custom Cards
        </Label>
        <Switch
          id="custom-card"
          checked={isCustomCard}
          onCheckedChange={setIsCustomCard}
        />
      </div>

      {!isCustomCard ? (
        <BankSelectionDialog
          selectedBank={selectedBank}
          onBankSelect={onBankSelect}
          showBankSearch={showBankSearch}
          setShowBankSearch={setShowBankSearch}
          banks={banks}
        />
      ) : (
        <Input
          placeholder="Enter your card name"
          value={customBankName}
          onChange={handleCustomNameChange}
          className="h-12 w-full py-2 px-0 text-base bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:border-primary rounded-none font-sans text-gray-600 placeholder:text-gray-400"
        />
      )}
      
      <div className="space-y-4">
        <Input
          placeholder="Enter last 4 digits"
          value={lastFourDigits}
          onChange={handleLastFourDigitsChange}
          maxLength={4}
          className="h-12 w-full py-2 px-0 text-base bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:border-primary rounded-none font-sans text-gray-600 placeholder:text-gray-400"
        />

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
          <Input
            placeholder="Enter credit limit"
            value={creditLimit}
            onChange={handleCreditLimitChange}
            className="h-12 w-full py-2 pl-8 pr-0 text-base bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:border-primary rounded-none font-sans text-gray-600 placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};