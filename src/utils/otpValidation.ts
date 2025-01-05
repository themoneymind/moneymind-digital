export const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isValidPhone = (value: string): boolean => {
  return /^\+?[\d\s-]{10,}$/.test(value);
};

export const getContactType = (value: string): 'email' | 'phone' | 'invalid' => {
  if (isValidEmail(value)) return 'email';
  if (isValidPhone(value)) return 'phone';
  return 'invalid';
};