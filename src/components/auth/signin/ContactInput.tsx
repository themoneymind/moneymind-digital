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
  const cursorPositionRef = useRef<number>(0);

  // Update cursor position after value changes
  useEffect(() => {
    if (!inputRef.current || inputType !== 'phone' || !isPhoneNumber(contact)) {
      return;
    }

    const input = inputRef.current;
    const position = Math.min(cursorPositionRef.current, contact.length);
    
    // Ensure cursor position is set after React updates the input value
    window.requestAnimationFrame(() => {
      if (document.activeElement === input) {
        input.setSelectionRange(position, position);
      }
    });
  }, [contact, inputType]);

  const updateCursorPosition = (input: HTMLInputElement) => {
    if (inputType === 'phone') {
      cursorPositionRef.current = input.selectionStart || 0;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCursorPosition(e.target);
    onContactChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    updateCursorPosition(e.target as HTMLInputElement);
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    updateCursorPosition(e.target as HTMLInputElement);
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