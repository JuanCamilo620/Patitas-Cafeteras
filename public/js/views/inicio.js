import { listarTurnos, estado } from '../api.js';
import { moneda } from '../utils.js';
import { tarjetaTurno } from './componentes.js';

export async function montar(raiz) {
  const turnos = await listarTurnos();
  const prios = turnos.filter(t => t.prioritario).length;
  const total = turnos.reduce((sum, t) => sum + t.totalPagar, 0);
  const { N, porcentajeRecargo } = estado.config;

  raiz.innerHTML = `
    <div class="card">
      <div class="card-body" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2 style="font-size:24px; font-weight:700; margin-bottom:8px;">Bienvenido a Patitas Cafeteras</h2>
          <p style="color:var(--text-muted); font-size:15px;">Gestiona los turnos, revisa las tarifas y administra tu spa canino.</p>
        </div>
        <div style="display:flex; gap:12px;">
          <a href="#/nuevo" class="btn btn-primary">Nuevo Turno</a>
          <a href="#/turnos" class="btn btn-outline">Ver Turnos</a>
        </div>
      </div>
    </div>

    <div class="grid-stats">
      <div class="stat">
        <div class="stat-icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
        </div>
        <div><strong>${turnos.length}</strong><span>Turnos registrados</span></div>
      </div>
      <div class="stat">
        <div class="stat-icon ambar">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        </div>
        <div><strong>${prios}</strong><span>Prioritarios</span></div>
      </div>
      <div class="stat">
        <div class="stat-icon verde">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <div><strong>${moneda(total)}</strong><span>Total a cobrar</span></div>
      </div>
      <div class="stat">
        <div class="stat-icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
        </div>
        <div><strong>${porcentajeRecargo}%</strong><span>Recargo (N = ${N})</span></div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><h2>Últimos turnos</h2><a href="#/turnos" style="font-size:13px; font-weight:600;">Ver todos</a></div>
        <div class="card-body" style="display:flex; flex-direction:column; gap:16px;">
          ${turnos.length === 0 ? '<p>No hay turnos.</p>' : turnos.slice(-2).reverse().map(tarjetaTurno).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h2>Accesos rápidos</h2></div>
        <div class="card-body" style="display:flex; flex-direction:column; gap:12px;">
          <a href="#/nuevo" class="btn btn-outline" style="justify-content:flex-start; padding:16px;">
            <span style="background:var(--primary-light); color:var(--primary); padding:10px; border-radius:8px; margin-right:12px;">➕</span>
            <div style="text-align:left"><strong style="display:block; color:var(--text-main)">Nuevo turno</strong><span style="font-size:12px; color:var(--text-muted); font-weight:400;">Registrar una cita</span></div>
          </a>
          <a href="#/pruebas" class="btn btn-outline" style="justify-content:flex-start; padding:16px;">
            <span style="background:var(--warning-light); color:var(--warning); padding:10px; border-radius:8px; margin-right:12px;">🧪</span>
            <div style="text-align:left"><strong style="display:block; color:var(--text-main)">Pruebas API</strong><span style="font-size:12px; color:var(--text-muted); font-weight:400;">Validar endpoints</span></div>
          </a>
        </div>
      </div>
    </div>
  `;
}
