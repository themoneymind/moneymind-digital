/**
 * Formats bank name for display in dropdown by removing 'Bank' suffix if it's at the end
 */
export const formatBankNameForDropdown = (name: string): string => {
  // If "Bank" is not in the name, or if it's in the middle (like "Bank of" or "Union Bank of"),
  // return the original name
  if (!name.includes('Bank') || 
      (name.toLowerCase().includes('bank of') || 
       name.toLowerCase().includes('bank india'))) {
    return name;
  }
  
  // If "Bank" is at the end, remove it
  return name.replace(/\sBank$/i, '').trim();
};

/**
 * Formats the final source name based on type (bank or credit card)
 */
export const formatSourceName = (bankName: string, type: "bank" | "credit"): string => {
  if (type === "credit") {
    const nameWithoutSuffixes = bankName
      .replace(/\s*bank\s*/gi, '')
      .replace(/\s*credit\s*card\s*/gi, '')
      .trim();
    return `${nameWithoutSuffixes} Credit Card`;
  }
  
  // For bank accounts, only add "Bank" suffix if it's not already part of the name
  const cleanName = bankName.trim();
  if (!cleanName.toLowerCase().includes('bank')) {
    return `${cleanName} Bank`;
  }
  return cleanName;
};