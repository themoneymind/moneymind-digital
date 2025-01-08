import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputIcon } from "./InputIcon";
import { CountryCode, countryCodes } from "./constants/countryCodes";
import { isPhoneNumber } from "@/utils/phoneInputUtils";

interface ContactInputProps {
  contact: string;
  setContact: (value: string) => void;
  isLoading: boolean;
}

export const ContactInput = ({ contact, setContact, isLoading }: ContactInputProps) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = countryCodes.find(country => country.code === e.target.value);
    if (newCountry) {
      setSelectedCountry(newCountry);
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContact(value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email or Phone</Label>
      <div className="relative">
        <InputIcon
          contact={contact}
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
        />
        <Input
          id="email"
          type={isPhoneNumber(contact) ? "tel" : "email"}
          placeholder={isPhoneNumber(contact) ? "Enter your phone number" : "Enter your email"}
          value={contact}
          onChange={handleContactChange}
          className={isPhoneNumber(contact) ? "pl-24" : "pl-10"}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};