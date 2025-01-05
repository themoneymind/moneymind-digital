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
    <div className="flex items-center gap-1">
      <span className="text-sm">{selectedCountry.flag}</span>
      <select
        value={selectedCountry.code}
        onChange={onCountryChange}
        className="w-[60px] h-8 border-0 bg-transparent focus:ring-0 text-sm appearance-none cursor-pointer text-gray-600 font-medium"
      >
        {countryCodes.map((country) => (
          <option key={country.code} value={country.code} className="flex items-center gap-2">
            {country.flag} {country.dialCode}
          </option>
        ))}
      </select>
    </div>
  );
};