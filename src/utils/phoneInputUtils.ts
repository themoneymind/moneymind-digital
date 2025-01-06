export const isPhoneNumber = (value: string) => /^\d*$/.test(value);

export const getInputType = (value: string): 'email' | 'phone' => {
  if (/[a-zA-Z]/.test(value) || value.includes('@')) {
    return 'email';
  }
  return isPhoneNumber(value) ? 'phone' : 'email';
};

export const getPlaceholder = (contact: string) => {
  if (contact.length === 0) {
    return "Email or Phone number";
  }
  return isPhoneNumber(contact) ? 'Phone number' : 'Email';
};