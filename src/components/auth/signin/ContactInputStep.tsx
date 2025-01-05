import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getContactType } from "@/utils/otpValidation";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  // Add more country codes as needed
];

export const ContactInputStep = ({
  contact,
  setContact,
  handleSendOtp,
  isLoading,
}: ContactInputStepProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]); // Default to India
  const [inputType, setInputType] = useState<'email' | 'phone'>('phone'); // Default to phone

  useEffect(() => {
    // Detect if input is email or phone
    const type = getContactType(contact);
    setInputType(type === 'email' ? 'email' : 'phone');
    
    // If it's a phone number and doesn't start with the selected country code
    if (type === 'phone' && !contact.startsWith(selectedCountry.dialCode)) {
      setContact(selectedCountry.dialCode + (contact.startsWith('+') ? contact.slice(contact.indexOf(' ') + 1) : contact));
    }
  }, [selectedCountry, contact]);

  const handleContactChange = (value: string) => {
    if (value.includes('@')) {
      setInputType('email');
    } else {
      setInputType('phone');
      // If input doesn't start with +, assume it's a phone number
      if (!value.startsWith('+')) {
        value = selectedCountry.dialCode + ' ' + value.replace(/^\+\d+\s?/, '');
      }
    }
    setContact(value);
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countryCodes.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      const phoneNumber = contact.replace(/^\+\d+\s?/, '');
      setContact(country.dialCode + ' ' + phoneNumber);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {inputType === 'phone' ? (
            <Select
              value={selectedCountry.code}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className="w-[100px] h-8 border-0 bg-white focus:ring-0">
                <SelectValue>
                  <div className="flex items-center gap-1">
                    <span className="text-base">{selectedCountry.flag}</span>
                    <span className="text-[#7F3DFF] text-sm font-medium">{selectedCountry.dialCode}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.dialCode}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Mail className="h-4 w-4 text-[#7F3DFF]" />
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