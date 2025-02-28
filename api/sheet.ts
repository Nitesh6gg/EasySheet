const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const RANGE = 'Sheet1!A1:D10'; // Adjust as needed
const API_KEY = 'YOUR_API_KEY';
const SHEETS_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?valueRenderOption=FORMATTED_VALUE&key=${API_KEY}`;
