import { useState } from "react";
import { InputIcon } from "./InputIcon";
import { ContactInputField } from "./ContactInputField";
import { CountryCode } from "./constants/countryCodes";
import { isPhoneNumber } from "@/utils/phoneInputUtils";

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
      <ContactInputField
        contact={contact}
        inputType={inputType}
        isLoading={isLoading}
        onChange={onContactChange}
        className={inputPadding}
      />
    </div>
  );
};