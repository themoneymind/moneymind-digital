import { Input } from "@/components/ui/input";
import { useContactInput } from "@/hooks/useContactInput";
import { getInputType, getPlaceholder, isPhoneNumber } from "@/utils/phoneInputUtils";

interface ContactInputFieldProps {
  contact: string;
  inputType: 'email' | 'phone';
  isLoading: boolean;
  onChange: (value: string) => void;
  className?: string;
}

export const ContactInputField = ({
  contact,
  inputType,
  isLoading,
  onChange,
  className = "",
}: ContactInputFieldProps) => {
  const { inputRef, updateCursorPosition } = useContactInput(contact, inputType);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCursorPosition(e.target);
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    updateCursorPosition(e.target as HTMLInputElement);
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    updateCursorPosition(e.target as HTMLInputElement);
  };

  return (
    <Input
      ref={inputRef}
      type={inputType === 'phone' && isPhoneNumber(contact) ? 'tel' : 'email'}
      placeholder={getPlaceholder(contact)}
      value={contact}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      className={`w-full py-3 md:text-sm text-base bg-transparent border-t-0 border-x-0 border-b-2 border-gray-200 rounded-none focus:outline-none transition-colors placeholder:text-gray-400 text-gray-600 focus:border-[#7F3DFF] focus:ring-0 ${className}`}
      disabled={isLoading}
      required
    />
  );
};