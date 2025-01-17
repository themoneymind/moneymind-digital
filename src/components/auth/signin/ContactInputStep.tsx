import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactInput } from "./ContactInput";
import { countryCodes, type CountryCode } from "./constants/countryCodes";

interface ContactInputStepProps {
  contact: string;
  setContact: (value: string) => void;
  handleSendOtp: () => void;
  isLoading: boolean;
}

export const ContactInputStep = ({
  contact,
  setContact,
  handleSendOtp,
  isLoading,
}: ContactInputStepProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]);
  const [inputType, setInputType] = useState<'email' | 'phone'>('email');

  const handleContactChange = (value: string) => {
    setContact(value);
    
    // Detect input type based on content
    if (/[a-zA-Z]/.test(value) || value.includes('@')) {
      setInputType('email');
    } else if (value === '' || /^\d*$/.test(value)) {
      setInputType('phone');
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = event.target.value;
    const country = countryCodes.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
    }
  };

  return (
    <div className="space-y-6">
      <ContactInput
        contact={contact}
        inputType={inputType}
        isLoading={isLoading}
        selectedCountry={selectedCountry}
        onContactChange={handleContactChange}
        onCountryChange={handleCountryChange}
      />

      <Button 
        onClick={handleSendOtp}
        className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        disabled={isLoading || !contact}
      >
        {isLoading ? "Please wait..." : "Send OTP"}
      </Button>
    </div>
  );
};