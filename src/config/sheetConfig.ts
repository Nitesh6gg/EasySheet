export const SPREADSHEET_ID = '17gHXssleqo6LPp4XP8xzU0Vpt1NBjbIdgtEJlC8RaJk';
export const RANGE = 'Sheet1!A1:Q999'; // Adjust as needed
export const API_KEY = 'AIzaSyBN5c4SopZBhx18csw4bta4gjftH_sDDK8';

export const SHEETS_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?valueRenderOption=FORMATTED_VALUE&key=${API_KEY}`;
