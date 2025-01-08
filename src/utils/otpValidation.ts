export const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isValidPhone = (value: string): boolean => {
  // Updated regex to handle international phone numbers with country codes
  return /^\+\d{1,4}\s?\d{6,14}$/.test(value);
};

export const getContactType = (value: string): 'email' | 'phone' | 'invalid' => {
  // Temporarily only return email validation
  if (isValidEmail(value)) return 'email';
  return 'invalid';
  
  // Code kept for future phone implementation
  // if (isValidPhone(value) || value.startsWith('+')) return 'phone';
};