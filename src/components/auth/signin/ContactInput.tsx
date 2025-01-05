import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CountrySelector } from "./CountrySelector";
import { CountryCode } from "./constants/countryCodes";

interface ContactInputProps {
  contact: string;
  inputType: 'email' | 'phone';
  isLoading: boolean;
  selectedCountry: CountryCode;
  onContactChange: (value: string) => void;
  onCountryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const ContactInput = ({
  contact,
  inputType,
  isLoading,
  selectedCountry,
  onContactChange,
  onCountryChange,
}: ContactInputProps) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {inputType === 'phone' ? (
          <CountrySelector
            selectedCountry={selectedCountry}
            onCountryChange={onCountryChange}
          />
        ) : (
          <Mail className="h-4 w-4 text-[#7F3DFF]" />
        )}
      </div>
      <Input
        type="text"
        placeholder="Email or Phone number"
        value={contact}
        onChange={(e) => onContactChange(e.target.value)}
        className={`w-full py-3 ${inputType === 'phone' ? 'pl-32' : 'pl-10'} md:text-sm text-base bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF] focus:ring-0`}
        disabled={isLoading}
        required
      />
    </div>
  );
};