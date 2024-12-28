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