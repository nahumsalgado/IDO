declare var google: any;
import { Usuario, CONFIG, Rol, Region } from './data';
import { fetchSheetData } from './sheets';

let tokenClient: any;
let accessToken: string | null = null;

export async function initAuth(): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CONFIG.CLIENT_ID,
        scope: CONFIG.SCOPES,
        callback: (tokenResponse: any) => {
          accessToken = tokenResponse.access_token;
          if (typeof (window as any).onAuthSuccess === 'function') {
            (window as any).onAuthSuccess(tokenResponse);
          }
          resolve();
        },
      });
      resolve();
    };
    document.body.appendChild(script);
  });
}

export function login(): void {
  tokenClient.requestAccessToken({ prompt: 'consent' });
}

export function logout(): void {
  accessToken = null;
  location.reload();
}

export function getAccessToken(): string | null {
  return accessToken;
}

export async function getCurrentUser(email: string): Promise<Usuario | null> {
  try {
    const data = await fetchSheetData(CONFIG.SHEET_ID_AUDITORIA, 'USUARIOS!A2:E20');
    const userRow = data.rows.find(row => row[0] && row[0].toLowerCase() === email.toLowerCase());

    if (!userRow) return null;

    return {
      email: userRow[0],
      nombre: userRow[1] || '',
      rol: userRow[2] as Rol,
      region: userRow[3] as Region,
      aliasCuadrilla: userRow[4] || undefined
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
