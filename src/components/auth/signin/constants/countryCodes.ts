export interface CountryCode {
  code: string;
  flag: string;
  dialCode: string;
}

export const countryCodes: CountryCode[] = [
  { code: 'IN', flag: '🇮🇳', dialCode: '+91' },
  { code: 'US', flag: '🇺🇸', dialCode: '+1' },
  { code: 'UK', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU', flag: '🇦🇺', dialCode: '+61' },
  { code: 'SG', flag: '🇸🇬', dialCode: '+65' },
  { code: 'AE', flag: '🇦🇪', dialCode: '+971' },
];