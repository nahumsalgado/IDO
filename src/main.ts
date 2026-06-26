import './style.css';
import { initAuth, login, getCurrentUser } from './auth';
import { UI } from './ui';
import { getCuadrillasVisibles, calculateIDO } from './ido';

async function bootstrap() {
  await initAuth();

  UI.renderLogin(async () => {
    login();
  });
}

// Interceptamos el éxito del login desde el callback de auth.ts
window.addEventListener('load', () => {
  // Manejador global para el flujo de autenticación exitoso
  (window as any).onAuthSuccess = async (tokenResponse: any) => {
    try {
      // 1. Obtener email del usuario (usando endpoint userinfo)
      const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
      });
      
      if (!resp.ok) {
        throw new Error('No se pudo obtener la información del usuario');
      }
      
      const profile = await resp.json();
      
      // 2. Buscar en tabla Usuarios
      const user = await getCurrentUser(profile.email);
      
      if (!user) {
        alert('Usuario no autorizado en el sistema de bonos. Por favor contacte al administrador.');
        return;
      }

      // 3. Renderizar Dashboard
      const cuadrillas = getCuadrillasVisibles(user);
      UI.renderDashboard(user, cuadrillas, async (alias: string, mes: number) => {
        try {
          const año = new Date().getFullYear();
          const resultado = await calculateIDO(alias, mes, año);
          UI.renderIDO(resultado);
        } catch (error) {
          console.error("Error calculating IDO:", error);
          alert("Error al cargar los datos de KPI. Asegúrese de que tiene permisos de lectura en la hoja de cálculo de Google.");
        }
      });
    } catch(err) {
      console.error("Error during authentication flow:", err);
      alert("Ocurrió un error al iniciar sesión.");
    }
  };
});

bootstrap();
