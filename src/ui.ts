import { Usuario } from './data';
import { IDOResult } from './ido';
import { logout } from './auth';

export const UI = {
  renderLogin: (onLogin: Function) => {
    const root = document.getElementById('app')!;
    root.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full">
        <div class="bg-white rounded-lg border border-[#ddd] shadow-sm p-8 text-center flex flex-col items-center w-full max-w-sm">
          <div class="w-12 h-12 bg-[#185FA5] rounded flex items-center justify-center text-white mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <h1 class="text-xl font-bold uppercase tracking-tight mb-2">KPIs Operativos</h1>
          <p class="text-[12px] text-[#555] mb-6">Inicie sesión con su cuenta institucional</p>
          <button id="btnLogin" class="w-full bg-[#185FA5] text-white px-6 py-2 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity">Iniciar sesión con Google</button>
        </div>
      </div>
    `;
    document.getElementById('btnLogin')?.addEventListener('click', () => onLogin());
  },

  renderDashboard: (user: Usuario, cuadrillasVisibles: any[], onFilterChange: Function) => {
    const root = document.getElementById('app')!;
    root.innerHTML = `
      <header class="bg-white border-b border-[#ddd] h-16 flex items-center justify-between px-6 flex-shrink-0">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-[#185FA5] rounded flex items-center justify-center text-white font-bold">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <div>
            <h1 class="text-lg font-bold uppercase tracking-tight leading-none">Servnet KPIs Operativos</h1>
            <span class="text-[10px] text-[#555] uppercase tracking-widest">Portal de Gestión de Bonos - Planta Externa</span>
          </div>
        </div>
        
        <div class="flex items-center gap-4 border-l pl-6 border-[#ddd]">
          <div class="text-right hidden sm:block">
            <div class="font-semibold text-sm">${user.nombre}</div>
            <div class="text-[11px] text-[#555] flex gap-2">
              <span class="bg-[#185FA5] text-white px-1.5 rounded-sm uppercase">${user.rol}</span>
              <span class="bg-white border border-[#ddd] px-1.5 rounded-sm uppercase">Región: ${user.region}</span>
            </div>
          </div>
          <button id="btnLogout" class="p-2 hover:bg-[#f1efe8] rounded transition-colors text-[#D85A30]" title="Cerrar Sesión">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </header>

      <nav class="bg-[#f1efe8] h-14 border-b border-[#ddd] flex items-center px-6 gap-4 flex-shrink-0">
        <div class="flex items-center gap-2">
          <label class="text-[11px] font-bold text-[#555] uppercase">Periodo:</label>
          <select id="selMes" class="bg-white border border-[#ddd] px-3 py-1 text-sm rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-[#185FA5]">
            ${['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
              .map((m, i) => `<option value="${i}" ${i === new Date().getMonth() ? 'selected' : ''}>${m}</option>`).join('')}
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-[11px] font-bold text-[#555] uppercase">Cuadrilla:</label>
          <select id="selCuadrilla" class="bg-white border border-[#ddd] px-3 py-1 text-sm rounded shadow-sm min-w-[150px] focus:outline-none focus:ring-1 focus:ring-[#185FA5]">
            ${cuadrillasVisibles.map(c => `<option value="${c.alias}">${c.alias} (${c.region})</option>`).join('')}
          </select>
        </div>
        <div class="h-6 w-[1px] bg-[#ddd] mx-2 hidden sm:block"></div>
        <button id="btnRefresh" class="bg-[#185FA5] hover:bg-opacity-90 transition-opacity text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-2 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <span class="hidden sm:inline">Actualizar Datos</span>
        </button>
      </nav>

      <main class="flex-1 p-6 min-h-0 overflow-hidden flex flex-col">
        <div id="kpiContent" class="flex-1 flex min-h-0">
          <div class="m-auto text-sm italic text-[#555]">Seleccione una cuadrilla y presione Actualizar</div>
        </div>
      </main>
    `;

    document.getElementById('btnLogout')?.addEventListener('click', logout);
    
    const triggerChange = () => {
      const mes = (document.getElementById('selMes') as HTMLSelectElement).value;
      const cuadrilla = (document.getElementById('selCuadrilla') as HTMLSelectElement).value;
      
      const container = document.getElementById('kpiContent')!;
      container.innerHTML = '<div class="m-auto text-sm italic text-[#555]">Cargando datos...</div>';
      container.className = 'flex-1 flex min-h-0';
      
      onFilterChange(cuadrilla, parseInt(mes));
    };

    document.getElementById('btnRefresh')?.addEventListener('click', triggerChange);
    if(cuadrillasVisibles.length > 0) {
       triggerChange();
    }
  },

  renderIDO: (data: IDOResult) => {
    const container = document.getElementById('kpiContent')!;
    container.className = 'flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0';
    container.innerHTML = `
      <!-- LEFT: KPI SCORECARD -->
      <section class="md:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pr-1">
        <!-- PRIMARY KPI: IDO -->
        <div class="bg-white rounded-lg border border-[#ddd] shadow-sm p-6 flex flex-col flex-shrink-0">
          <div class="flex justify-between items-start mb-4">
            <div>
              <span class="text-[10px] font-bold text-[#185FA5] uppercase tracking-widest">Métrica Principal</span>
              <h2 class="text-xl font-bold">IDO / Productividad</h2>
            </div>
            <div class="bg-[#185FA5]/10 text-[#185FA5] px-2 py-1 rounded text-[10px] font-bold">35% BONO</div>
          </div>

          <div class="flex flex-col items-center py-6 border-y border-dashed border-[#ddd] mb-6">
            <div class="text-6xl font-black text-[#1a1a1a] flex items-baseline">
              ${data.totalPuntos.toFixed(1)}
              <span class="text-xl text-[#555] font-normal ml-2">PTS</span>
            </div>
            <div class="text-lg font-bold text-[#0F6E56] mt-2">
              ${(data.porcentajeKPI * 100).toFixed(2)}% Ganado
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex flex-col gap-1.5">
              <div class="flex justify-between text-[11px] font-bold">
                <span class="text-[#555]">Escala de Puntos</span>
                <span>Tope: 47 pts</span>
              </div>
              <div class="h-3 bg-[#f1efe8] rounded-full overflow-hidden flex">
                <div class="bg-[#0F6E56] h-full transition-all duration-500" style="width: ${(Math.min(data.porcentajeKPI / 0.35, 1)) * 100}%"></div>
              </div>
              <div class="flex justify-between text-[10px] text-[#555] italic pt-1">
                <span>31 pts (15%)</span>
                <span>Act: ${data.totalPuntos.toFixed(1)} pts</span>
                <span>47 pts (35%)</span>
              </div>
            </div>

            <div class="bg-[#f1efe8] rounded p-3 mt-4">
              <div class="text-[10px] font-bold uppercase text-[#555] mb-2">Fórmula Aplicada</div>
              <code class="text-[11px] font-mono leading-tight block">
                % = 15% + ((${data.totalPuntos.toFixed(1)} - 31) / 16) × 20%<br/>
                Result: ${(data.porcentajeKPI * 100).toFixed(2)}%
              </code>
            </div>
          </div>
        </div>

        <!-- KPI BREAKDOWN -->
        <div class="bg-white rounded-lg border border-[#ddd] shadow-sm p-4 flex-shrink-0 mb-4">
          <h3 class="text-[12px] font-bold uppercase text-[#555] mb-4 border-b border-[#eee] pb-2">Composición del Bono Mensual</h3>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-1.5 h-10 bg-[#0F6E56] rounded-full"></div>
              <div class="flex-1">
                <div class="text-[11px] font-bold">PRODUCTIVIDAD (IDO)</div>
                <div class="text-lg font-semibold">${(data.porcentajeKPI * 100).toFixed(2)}% / 35.00%</div>
              </div>
            </div>
            <div class="flex items-center gap-3 opacity-50">
              <div class="w-1.5 h-10 bg-[#854F0B] rounded-full"></div>
              <div class="flex-1">
                <div class="text-[11px] font-bold uppercase">Auditorías Técnicas</div>
                <div class="text-lg font-semibold">Pendiente / 20.00%</div>
              </div>
            </div>
            <div class="flex items-center gap-3 opacity-50">
              <div class="w-1.5 h-10 bg-[#555] rounded-full"></div>
              <div class="flex-1">
                <div class="text-[11px] font-bold">CUMPLIMIENTO SLA</div>
                <div class="text-lg font-semibold">Pendiente / 45.00%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- RIGHT: DATA TABLE -->
      <section class="md:col-span-8 flex flex-col min-h-0 h-full">
        <div class="bg-white rounded-lg border border-[#ddd] shadow-sm flex flex-col h-full">
          <div class="p-4 border-b border-[#ddd] flex justify-between items-center bg-[#fafaf9] flex-shrink-0">
            <h3 class="text-sm font-bold">Registros ServiceRequest</h3>
            <span class="text-[11px] bg-[#1a1a1a] text-white px-2 py-0.5 rounded">${data.registros.length} Servicios Filtrados</span>
          </div>
          
          <div class="flex-1 overflow-auto">
            <table class="w-full border-collapse text-left">
              <thead class="sticky top-0 bg-white shadow-sm z-10">
                <tr class="text-[11px] uppercase tracking-wider text-[#555] border-b border-[#ddd]">
                  <th class="px-4 py-3 font-bold">ID</th>
                  <th class="px-4 py-3 font-bold">Tipo de Servicio</th>
                  <th class="px-4 py-3 font-bold">Fecha/Hora</th>
                  <th class="px-4 py-3 font-bold text-right">Valor Pts</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#eee] text-sm">
                ${data.registros.length === 0 ? '<tr><td colspan="4" class="px-4 py-8 text-center text-[#555] italic">No hay registros para este periodo.</td></tr>' : data.registros.map(r => `
                  <tr class="hover:bg-[#f9f9f7]">
                    <td class="px-4 py-3 font-mono text-[12px] text-[#555]">${r.id || 'N/A'}</td>
                    <td class="px-4 py-3 font-medium">${r.tipo || 'Sin Tipo'}</td>
                    <td class="px-4 py-3 text-[#555]">${r.fecha.toLocaleString('es-MX', {day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'})}</td>
                    <td class="px-4 py-3 text-right font-bold text-[#1a1a1a]">${r.valor}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="p-4 border-t border-[#ddd] bg-[#fafaf9] flex justify-between items-center text-[11px] font-bold uppercase text-[#555] flex-shrink-0">
            <div class="flex gap-4">
              <span>Total Registros: ${data.registros.length}</span>
              <span>Suma Total Puntos: ${data.totalPuntos.toFixed(1)}</span>
            </div>
            <div class="text-[#185FA5] hidden sm:block">
              Visualizando datos del periodo seleccionado
            </div>
          </div>
        </div>
      </section>
    `;
  }
};
