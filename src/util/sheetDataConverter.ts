// Define the interface for the Google Sheets API response
export interface SheetResponse {
  range: string;
  majorDimension: string;
  values: string[][];
}

/**
 * Converts a Google Sheets API response into an array of objects.
 * The first row is assumed to be the header row, and each subsequent row is mapped accordingly.
 *
 * @param sheetData - The API response from Google Sheets.
 * @returns An array of objects with keys from the header row.
 */
export const convertSheetDataToObjects = (sheetData: SheetResponse): Record<string, string>[] => {
  const { values } = sheetData;
  if (!values || values.length === 0) return [];

  // The first row is assumed to be the headers
  const headers = values[0];
  // All rows after the header row are data rows
  const rows = values.slice(1);

  return rows.map((row: string[]) => {
    const rowObject: Record<string, string> = {};
    headers.forEach((header, index) => {
      // Use empty string if a value is missing
      rowObject[header] = row[index] || "";
    });
    return rowObject;
  });
};
