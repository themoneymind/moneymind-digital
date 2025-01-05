import { ChevronDown } from "lucide-react";
import { CountryCode, countryCodes } from "./constants/countryCodes";

interface CountrySelectorProps {
  selectedCountry: CountryCode;
  onCountryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const CountrySelector = ({
  selectedCountry,
  onCountryChange,
}: CountrySelectorProps) => {
  return (
    <div className="flex items-center gap-1 min-w-[100px]">
      <div className="flex items-center gap-1">
        <img 
          src={`https://flagcdn.com/${selectedCountry.code.toLowerCase()}.svg`}
          alt={`${selectedCountry.code} flag`}
          className="w-4 h-3 object-cover rounded-sm"
        />
        <select
          value={selectedCountry.code}
          onChange={onCountryChange}
          className="appearance-none bg-transparent border-none focus:ring-0 text-sm text-[#7F3DFF] font-medium cursor-pointer pr-4"
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {country.dialCode}
            </option>
          ))}
        </select>
        <ChevronDown className="h-3 w-3 text-[#7F3DFF]" />
      </div>
    </div>
  );
};