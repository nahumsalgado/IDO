export const CONFIG = {
  CLIENT_ID: '995994507665-vnqcv5htfmi0in4u0qtjf11vqo3u5qlr.apps.googleusercontent.com',
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  SHEET_ID_AUDITORIA: '1-iiH6ydbawhNRaGux8xm7z-0qFLYK-LyLlKdhwXw_RI',
  SHEET_ID_DATA_SOURCE: '17Xl8lTG0D9kmtDJg7qYsLT2gp-iPGWYXBqkn4_jC6Zs'
};

export type Rol = 'GERENTE_GENERAL' | 'GERENTE_OPERACIONES' | 'COORDINADOR' | 'RH' | 'DESPACHO' | 'CUADRILLA';
export type Region = 'CMX' | 'MTY' | 'QRO' | 'TODAS';

export interface Cuadrilla {
  alias: string;
  region: Region;
}

export const CUADRILLAS: Cuadrilla[] = [
  { alias: 'Octopus', region: 'CMX' }, { alias: 'Kraken', region: 'CMX' },
  { alias: 'Raptor', region: 'CMX' }, { alias: 'SilentFiber', region: 'CMX' },
  { alias: 'Eastman', region: 'CMX' }, { alias: 'Pegaso', region: 'CMX' },
  { alias: 'Megatron', region: 'MTY' }, { alias: 'Dynamo', region: 'MTY' },
  { alias: 'Neptuno', region: 'QRO' }
];

export interface Usuario {
  email: string;
  nombre: string;
  rol: Rol;
  region: Region;
  aliasCuadrilla?: string;
}

export interface ServiceRow {
  id: string;
  cuadrilla: string;
  valor: number;
  fecha: Date;
  tipo: string;
}

export const ESCALA_IDO = {
  MIN_PTS: 31,
  MAX_PTS: 47,
  MIN_BONO: 0.15, // 15%
  MAX_BONO: 0.35  // 35%
};
