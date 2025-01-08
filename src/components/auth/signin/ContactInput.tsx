import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { InputIcon } from "./InputIcon";
import { CountryCode } from "./constants/countryCodes";
import { isPhoneNumber, getInputType, getPlaceholder } from "@/utils/phoneInputUtils";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const newValue = input.value;
    onContactChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const position = input.selectionStart;
    if (position !== null) {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(position, position);
        }
      });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const position = input.selectionStart;
    if (position !== null) {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(position, position);
        }
      });
    }
  };

  // Temporarily force email input type
  const showEmailOnly = true;

  return (
    <div className="relative">
      <InputIcon
        contact={showEmailOnly ? "" : contact}  // This prevents phone UI from showing
        selectedCountry={selectedCountry}
        onCountryChange={onCountryChange}
      />
      <Input
        ref={inputRef}
        type="email"
        placeholder="Enter your email"
        value={contact}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        className="w-full py-3 pl-10 md:text-sm text-base bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF] focus:ring-0"
        disabled={isLoading}
        required
      />
    </div>
  );
};