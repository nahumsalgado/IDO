import { getAccessToken } from './auth';

export interface SheetData {
  headers: string[];
  rows: string[][];
}

/**
 * Abstracción de acceso a datos. 
 * Si se migra a Firebase, solo se modifica esta función.
 */
export async function fetchSheetData(sheetId: string, range: string): Promise<SheetData> {
  const token = getAccessToken();
  if (!token) throw new Error('No autenticado');

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`;
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener datos de Google Sheets: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const rows = data.values || [];
  
  return {
    headers: rows.length > 0 ? rows[0] : [],
    rows: rows.slice(1)
  };
}
