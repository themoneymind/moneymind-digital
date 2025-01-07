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

    // For phone numbers, always place cursor at the end
    if (isPhoneNumber(newValue)) {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          const position = newValue.length;
          inputRef.current.setSelectionRange(position, position);
        }
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // No need to store cursor position for phone numbers
    if (!isPhoneNumber(contact)) {
      const input = e.target as HTMLInputElement;
      const position = input.selectionStart;
      if (position !== null) {
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(position, position);
          }
        });
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Allow manual cursor positioning only for non-phone number input
    if (!isPhoneNumber(contact)) {
      const input = e.target as HTMLInputElement;
      const position = input.selectionStart;
      if (position !== null) {
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(position, position);
          }
        });
      }
    }
  };

  const inputPadding = inputType === 'phone' && contact.length > 0 && isPhoneNumber(contact)
    ? 'pl-[100px]'
    : 'pl-10';

  return (
    <div className="relative">
      <InputIcon
        contact={contact}
        selectedCountry={selectedCountry}
        onCountryChange={onCountryChange}
      />
      <Input
        ref={inputRef}
        type={inputType === 'phone' && isPhoneNumber(contact) ? 'tel' : 'email'}
        placeholder={getPlaceholder(contact)}
        value={contact}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        className={`w-full py-3 ${inputPadding} md:text-sm text-base bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF] focus:ring-0`}
        disabled={isLoading}
        required
      />
    </div>
  );
};