import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getContactType } from "@/utils/otpValidation";
import { useState, useEffect } from "react";

interface ContactInputStepProps {
  contact: string;
  setContact: (value: string) => void;
  handleSendOtp: () => void;
  isLoading: boolean;
}

interface CountryCode {
  code: string;
  flag: string;
  dialCode: string;
}

const countryCodes: CountryCode[] = [
  { code: 'IN', flag: '🇮🇳', dialCode: '+91' },
  { code: 'US', flag: '🇺🇸', dialCode: '+1' },
  { code: 'UK', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU', flag: '🇦🇺', dialCode: '+61' },
  { code: 'SG', flag: '🇸🇬', dialCode: '+65' },
  { code: 'AE', flag: '🇦🇪', dialCode: '+971' },
];

export const ContactInputStep = ({
  contact,
  setContact,
  handleSendOtp,
  isLoading,
}: ContactInputStepProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]);
  const [inputType, setInputType] = useState<'email' | 'phone'>('phone');

  // Detect input type whenever contact changes
  useEffect(() => {
    const type = getContactType(contact);
    if (type === 'email') {
      setInputType('email');
    } else if (type === 'phone' || type === 'invalid') {
      setInputType('phone');
      // Only add country code if it's not already present
      if (!contact.startsWith('+')) {
        const numericContact = contact.replace(/\D/g, '');
        setContact(selectedCountry.dialCode + ' ' + numericContact);
      }
    }
  }, [contact, selectedCountry.dialCode]);

  const handleContactChange = (value: string) => {
    if (value.includes('@')) {
      setInputType('email');
      setContact(value);
    } else {
      setInputType('phone');
      // Strip any existing country code and non-numeric characters
      const numericValue = value.replace(/^\+\d+\s?/, '').replace(/\D/g, '');
      if (numericValue || value === '') {
        setContact(value === '' ? '' : selectedCountry.dialCode + ' ' + numericValue);
      }
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = event.target.value;
    const country = countryCodes.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      // Update the contact with new country code
      const numericContact = contact.replace(/^\+\d+\s?/, '').replace(/\D/g, '');
      if (numericContact) {
        setContact(country.dialCode + ' ' + numericContact);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {inputType === 'email' ? (
            <Mail className="h-4 w-4 text-[#7F3DFF]" />
          ) : (
            <select
              value={selectedCountry.code}
              onChange={handleCountryChange}
              className="w-[100px] h-8 border-0 bg-white focus:ring-0 text-sm appearance-none cursor-pointer"
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.dialCode}
                </option>
              ))}
            </select>
          )}
        </div>
        <Input
          type="text"
          placeholder="Email or Phone Number"
          value={contact}
          onChange={(e) => handleContactChange(e.target.value)}
          className={`w-full py-3 ${inputType === 'phone' ? 'pl-32' : 'pl-10'} md:text-sm text-base bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF] focus:ring-0`}
          disabled={isLoading}
          required
        />
      </div>

      <Button 
        onClick={handleSendOtp}
        className="w-full h-12 rounded-xl md:text-sm text-base bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
        disabled={isLoading || !contact}
      >
        {isLoading ? "Sending..." : "Send OTP"}
      </Button>
    </div>
  );
};