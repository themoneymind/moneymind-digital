import { Mail } from "lucide-react";
import { CountrySelector } from "./CountrySelector";
import { CountryCode } from "./constants/countryCodes";
import { isPhoneNumber } from "@/utils/phoneInputUtils";

interface InputIconProps {
  contact: string;
  selectedCountry: CountryCode;
  onCountryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const InputIcon = ({
  contact,
  selectedCountry,
  onCountryChange,
}: InputIconProps) => {
  if (contact.length > 0 && isPhoneNumber(contact)) {
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