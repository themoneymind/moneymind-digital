/**
 * Extracts the base UUID from a payment source ID by removing any suffixes
 * @param sourceId Payment source ID that may include a suffix
 * @returns Clean UUID without any suffix
 */
export const getBaseSourceId = (sourceId: string): string => {
  // First check if it's a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(sourceId)) {
    return sourceId;
  }

  // Extract the UUID part before any suffix (like -gpay, -phonepe, etc.)
  const match = sourceId.match(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  if (!match) {
    console.error("Invalid source ID format:", sourceId);
    throw new Error("Invalid source ID format");
  }
  
  console.log("Extracted base source ID:", {
    original: sourceId,
    extracted: match[1]
  });
  
  return match[1];
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