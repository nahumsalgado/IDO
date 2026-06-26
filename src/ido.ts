import { ServiceRow, ESCALA_IDO, CUADRILLAS, Usuario } from './data';
import { fetchSheetData } from './sheets';
import { CONFIG } from './data';

export interface IDOResult {
  totalPuntos: number;
  porcentajeKPI: number;
  registros: ServiceRow[];
}

export async function calculateIDO(cuadrilla: string, mes: number, año: number): Promise<IDOResult> {
  // Optimizamos: Pedimos las últimas filas para cubrir 90 días aprox.
  const data = await fetchSheetData(CONFIG.SHEET_ID_DATA_SOURCE, 'ServiceRequest!A:H');
  
  // Mapeo de columnas basado en el conocimiento de la hoja
  // ID(0), Cuadrilla(1), Team(2), Valor(3), FechaHrFin(4), Tipo(5)
  const registros: ServiceRow[] = data.rows
    .map(row => ({
      id: row[0] || '',
      cuadrilla: row[1] || '', // Campo confiable según requerimiento
      valor: parseFloat(row[3]) || 0,
      fecha: new Date(row[4] || 0),
      tipo: row[5] || ''
    }))
    .filter(reg => {
      const matchCuadrilla = reg.cuadrilla === cuadrilla;
      const matchMes = reg.fecha.getMonth() === mes;
      const matchAño = reg.fecha.getFullYear() === año;
      return matchCuadrilla && matchMes && matchAño;
    });

  const totalPuntos = registros.reduce((acc, curr) => acc + curr.valor, 0);
  
  let porcentajeKPI = 0;
  if (totalPuntos >= ESCALA_IDO.MAX_PTS) {
    porcentajeKPI = ESCALA_IDO.MAX_BONO;
  } else if (totalPuntos < ESCALA_IDO.MIN_PTS) {
    porcentajeKPI = 0;
  } else {
    // Fórmula lineal: 15% + ((pts - 31) / 16) * 20%
    porcentajeKPI = ESCALA_IDO.MIN_BONO + ((totalPuntos - ESCALA_IDO.MIN_PTS) / (ESCALA_IDO.MAX_PTS - ESCALA_IDO.MIN_PTS)) * (ESCALA_IDO.MAX_BONO - ESCALA_IDO.MIN_BONO);
  }

  return {
    totalPuntos,
    porcentajeKPI,
    registros: registros.sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
  };
}

export function getCuadrillasVisibles(user: Usuario) {
  if (['GERENTE_GENERAL', 'GERENTE_OPERACIONES', 'RH', 'DESPACHO'].includes(user.rol)) {
    return CUADRILLAS;
  }
  if (user.rol === 'COORDINADOR') {
    return CUADRILLAS.filter(c => c.region === user.region);
  }
  if (user.rol === 'CUADRILLA') {
    return CUADRILLAS.filter(c => c.alias === user.aliasCuadrilla);
  }
  return [];
}
