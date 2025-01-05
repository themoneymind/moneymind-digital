import { CountryCode, countryCodes } from "./constants/countryCodes";
import { Separator } from "@/components/ui/separator";

interface CountrySelectorProps {
  selectedCountry: CountryCode;
  onCountryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const CountrySelector = ({
  selectedCountry,
  onCountryChange,
}: CountrySelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#7F3DFF]">{selectedCountry.dialCode}</span>
      <select
        value={selectedCountry.code}
        onChange={onCountryChange}
        className="w-[60px] h-8 border-0 bg-transparent focus:ring-0 text-sm appearance-none cursor-pointer text-gray-600 font-medium"
      >
        {countryCodes.map((country) => (
          <option key={country.code} value={country.code}>
            {country.dialCode}
          </option>
        ))}
      </select>
    </div>
  );
};