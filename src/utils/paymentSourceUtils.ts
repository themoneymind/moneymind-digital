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
    
  return cleanName.toLowerCase().includes('bank') 
    ? cleanName 
    : `${cleanName} Bank`;
};