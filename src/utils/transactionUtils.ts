/**
 * Extracts the base payment source ID by removing any UPI app suffix
 * @param sourceId - The source ID which may include a UPI app suffix
 * @returns The base payment source ID
 */
export const extractBaseSourceId = (sourceId: string): string => {
  return sourceId.split("-")[0];
};