import { useContext, useState } from 'react';
import { SpreadsheetContext } from '@/src/context/SpreadsheetContext';

export const useSheetService = () => {
  const [sheets, setSheets] = useState<any[]>([]);
  const { setSelectedSheet } = useContext(SpreadsheetContext);

  // Fetch user's all Google Sheets using the provided token'
  const fetchUserSheets = async (token: string) => {
    try {
      const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet'");
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setSheets(data.files || []);

      return data.files || [];
    } catch (error) {
      console.error("Error fetching sheets", error);
      throw error;
    }
  };

  const handleSheetSelect = (sheet: any) => {
    setSelectedSheet(sheet);
    console.log("Selected sheet:", sheet);
  };

  return {
    sheets,             // if you want to access the sheets from this hook directly
    fetchUserSheets,    // returns a Promise with the sheets
    handleSheetSelect,
  };
};
