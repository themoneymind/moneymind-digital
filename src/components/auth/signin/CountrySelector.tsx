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
    <select
      value={selectedCountry.code}
      onChange={onCountryChange}
      className="w-[100px] h-8 border-0 bg-white focus:ring-0 text-sm appearance-none cursor-pointer"
    >
      {countryCodes.map((country) => (
        <option key={country.code} value={country.code}>
          {country.flag} {country.dialCode}
        </option>
      ))}
    </select>
  );
};