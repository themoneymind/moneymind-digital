import { useRef, useEffect } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number | null>(null);

  useEffect(() => {
    if (
      inputRef.current && 
      cursorPositionRef.current !== null && 
      inputType === 'phone' && 
      /^\d*$/.test(contact)
    ) {
      const position = cursorPositionRef.current;
      inputRef.current.setSelectionRange(position, position);
    }
  }, [contact, inputType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    if (inputType === 'phone' && /^\d*$/.test(newValue)) {
      cursorPositionRef.current = cursorPosition;
    }
    
    onContactChange(newValue);
  };

  const renderInputIcon = () => {
    if (inputType === 'phone' && contact.length > 0 && /^\d*$/.test(contact)) {
      return (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <CountrySelector
            selectedCountry={selectedCountry}
            onCountryChange={onCountryChange}
          />
        </div>
      );
    }
    return (
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <Mail className="h-4 w-4 text-[#7F3DFF]" />
      </div>
    );
  };

  const getPlaceholder = () => {
    if (contact.length === 0) {
      return "Email or Phone number";
    }
    return inputType === 'phone' && /^\d*$/.test(contact) ? 'Phone number' : 'Email';
  };

  const inputPadding = inputType === 'phone' && contact.length > 0 && /^\d*$/.test(contact)
    ? 'pl-[100px]'
    : 'pl-10';

  return (
    <div className="relative">
      {renderInputIcon()}
      <Input
        ref={inputRef}
        type={inputType === 'phone' && /^\d*$/.test(contact) ? 'tel' : 'email'}
        placeholder={getPlaceholder()}
        value={contact}
        onChange={handleInputChange}
        className={`w-full py-3 ${inputPadding} md:text-sm text-base bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF] focus:ring-0`}
        disabled={isLoading}
        required
      />
    </div>
  );
};