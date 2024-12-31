/**
 * Extracts the base UUID from a payment source ID by removing any suffixes
 * @param sourceId Payment source ID that may include a suffix
 * @returns Clean UUID without any suffix
 */
export const getBaseSourceId = (sourceId: string): string => {
  // Extract the UUID part before any suffix
  const match = sourceId.match(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  return match ? match[1] : sourceId;
};

/**
 * Formats a bank name consistently by ensuring "Bank" suffix if needed
 * @param name Raw bank name
 * @returns Formatted bank name
 */
export const formatBankName = (name: string): string => {
  if (!name) return "";
  const cleanName = name
    .replace(/[0-9]+/g, '')  // Remove numbers
    .replace(/\s+/g, ' ')    // Normalize spaces
    .trim();                 // Remove leading/trailing spaces
  
  return cleanName.toLowerCase().includes('bank') ? cleanName : `${cleanName} Bank`;
};

/**
 * Formats a UPI source name consistently
 * @param bankName Base bank name
 * @param upiApp UPI app name
 * @returns Formatted UPI source name
 */
export const formatUpiSourceName = (bankName: string, upiApp: string): string => {
  const baseNameWithoutBank = formatBankName(bankName).replace(/\s*bank\s*/i, '');
  return `${baseNameWithoutBank} ${upiApp}`;
};

/**
 * Formats a payment source name for display
 * @param name Raw payment source name
 * @param displayName Optional pre-formatted display name from database
 * @returns Formatted name for display
 */
export const formatDisplayName = (name: string, displayName?: string | null): string => {
  if (displayName) return displayName;
  
  // Remove UUID-like parts and clean up the name
  const cleanName = name
    .replace(/[a-f0-9]{4,}/gi, '')
    .replace(/[0-9]+|[^\w\s]/g, '')
    .trim();
    
  return formatBankName(cleanName);
};