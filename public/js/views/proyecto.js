import { estado } from '../api.js';

export async function montar(raiz) {
  const { N, porcentajeRecargo } = estado.config;

  raiz.innerHTML = `
    <div class="card" style="margin-bottom:24px;">
      <div class="card-header"><h2>El Negocio</h2></div>
      <div class="card-body">
        <p><strong>Patitas Cafeteras</strong> es una peluquería y spa canino inspirada en el Eje Cafetero. Ofrece baño, corte, spa completo y desparasitación.</p>
        <p style="margin-top:12px;"><strong>Regla de Negocio Parametrizada (N):</strong> El valor de N se obtiene ordenando alfabéticamente por apellido a los integrantes del equipo. El primero en la lista ocupa el puesto #1, por lo tanto <strong>N = ${N}</strong> y el recargo prioritario es <strong>${N} × 2% = ${porcentajeRecargo}%</strong>.</p>
        <p style="margin-top:12px; color:var(--text-muted); font-size:13px;">Integrantes: Arenas Villa Juan Camilo (#1), Bedoya Calderon Bryan (#2), Patiño Jimenez Andres Felipe (#9).</p>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><h2>Arquitectura por Capas</h2></div>
        <div class="card-body">
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="background:#f8fafc; border:1px solid var(--border); padding:16px; border-radius:8px;"><strong>1. Cliente (Navegador)</strong><br><span style="font-size:13px; color:var(--text-muted)">Hace la petición HTTP al servidor</span></div>
            <div style="text-align:center; color:var(--text-muted);">↓</div>
            <div style="background:#fff; border:1px solid var(--border); padding:16px; border-radius:8px;"><strong>2. index.js</strong><br><span style="font-size:13px; color:var(--text-muted)">Inicia Express, middlewares y conecta rutas</span></div>
            <div style="text-align:center; color:var(--text-muted);">↓</div>
            <div style="background:#fff; border:1px solid var(--border); padding:16px; border-radius:8px;"><strong>3. routes/</strong><br><span style="font-size:13px; color:var(--text-muted)">Declara endpoints y asocia controladores</span></div>
            <div style="text-align:center; color:var(--text-muted);">↓</div>
            <div style="background:#fff; border:1px solid var(--border); padding:16px; border-radius:8px;"><strong>4. controllers/</strong><br><span style="font-size:13px; color:var(--text-muted)">Valida req, define código HTTP (200/201/400/404)</span></div>
            <div style="text-align:center; color:var(--text-muted);">↓</div>
            <div style="background:var(--primary-light); border:1px solid #bfdbfe; padding:16px; border-radius:8px;"><strong>5. services/</strong><br><span style="font-size:13px; color:var(--primary)">Lógica de negocio (N), cálculo de tarifas y datos en memoria</span></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h2>Endpoints de la API</h2></div>
        <div class="card-body">
          <table class="tabla" style="border:1px solid var(--border); border-radius:8px; overflow:hidden;">
            <thead><tr><th>Método</th><th>Ruta</th><th>Descripción</th></tr></thead>
            <tbody>
              <tr><td><span style="color:var(--success); font-weight:700;">GET</span></td><td><code>/api/turnos</code></td><td>Listar todos los turnos</td></tr>
              <tr><td><span style="color:var(--success); font-weight:700;">GET</span></td><td><code>/api/turnos/:id</code></td><td>Obtener un turno por ID</td></tr>
              <tr><td><span style="color:var(--primary); font-weight:700;">POST</span></td><td><code>/api/turnos</code></td><td>Registrar un nuevo turno</td></tr>
              <tr><td><span style="color:var(--success); font-weight:700;">GET</span></td><td><code>/api/turnos/config</code></td><td>Obtener N y porcentaje de recargo</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
