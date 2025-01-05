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
    <div className="relative flex items-center w-full">
      <div className="flex items-center gap-2 w-full border rounded-md px-3 py-2">
        <div className="flex items-center gap-2 min-w-[140px]">
          <img 
            src={`https://flagcdn.com/${selectedCountry.code.toLowerCase()}.svg`}
            alt={`${selectedCountry.code} flag`}
            className="w-5 h-4 object-cover rounded-sm"
          />
          <select
            value={selectedCountry.code}
            onChange={onCountryChange}
            className="appearance-none bg-transparent border-none focus:ring-0 text-sm text-gray-600 font-medium cursor-pointer pr-6"
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.dialCode}
              </option>
            ))}
          </select>
          <ChevronDown className="h-4 w-4 text-gray-400 absolute right-3" />
        </div>
      </div>
    </div>
  );
};