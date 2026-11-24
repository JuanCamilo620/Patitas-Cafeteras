import { llamarAPI } from '../api.js';
import { esperar } from '../utils.js';

const casos = [
  { id: 'getLista', metodo: 'GET', ruta: '/api/turnos', esperado: 200, desc: '1. Listar turnos' },
  { id: 'getId', metodo: 'GET', ruta: '/api/turnos/1', esperado: 200, desc: '2. Obtener turno #1' },
  { id: 'postOk', metodo: 'POST', ruta: '/api/turnos', esperado: 201, desc: '3. Crear turno prioritario', body: { nombreCliente: 'Test', nombreMascota: 'Test', tipoServicio: 'Spa', fechaHora: '2026-12-01T10:00:00', precioBase: 50000, prioritario: true } },
  { id: 'postNormal', metodo: 'POST', ruta: '/api/turnos', esperado: 201, desc: '4. Crear turno normal', body: { nombreCliente: 'Test', nombreMascota: 'Test', tipoServicio: 'Baño', fechaHora: '2026-12-01T11:00:00', precioBase: 30000, prioritario: false } },
  { id: 'postBad', metodo: 'POST', ruta: '/api/turnos', esperado: 400, desc: '5. Campos faltantes y negativo', body: { nombreCliente: '', precioBase: -5 } },
  { id: 'postCero', metodo: 'POST', ruta: '/api/turnos', esperado: 400, desc: '6. Precio base igual a cero', body: { nombreCliente: 'Test', nombreMascota: 'Test', tipoServicio: 'Baño', fechaHora: '2026-12-01T10:00:00', precioBase: 0 } },
  { id: 'get404', metodo: 'GET', ruta: '/api/turnos/999', esperado: 404, desc: '7. ID inexistente' }
];

export async function montar(raiz) {
  raiz.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h2>Pruebas de Endpoints (7 del documento)</h2>
        <div style="display:flex; gap:12px;">
          <button class="btn btn-outline btn-sm" id="btnClear">Limpiar Consola</button>
          <button class="btn btn-primary btn-sm" id="btnRunAll">Ejecutar Todas</button>
        </div>
      </div>
      <div class="card-body">
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${casos.map(c => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:16px; border:1px solid var(--border); border-radius:8px;" id="caso-${c.id}">
              <div>
                <strong style="display:block; font-size:15px;">${c.metodo} ${c.ruta} <span style="font-weight:400; color:var(--text-muted); font-size:13px;">— ${c.desc}</span></strong>
                <span style="font-size:13px; color:var(--text-muted);">Código esperado: <span class="badge" style="background:var(--bg-body)">${c.esperado}</span></span>
              </div>
              <div style="display:flex; align-items:center; gap:16px;">
                <span id="status-${c.id}" class="badge" style="background:var(--bg-body); color:var(--text-muted)">Pendiente</span>
                <button class="btn btn-outline btn-sm" onclick="document.dispatchEvent(new CustomEvent('run-test', {detail:'${c.id}'}))">Probar</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h2>Consola de Salida</h2></div>
      <div class="card-body" style="padding:0;">
        <div class="consola">
          <div class="consola-header">
            <span>Terminal de Pruebas</span>
            <span style="font-size:12px; color:#64748b;">(Acumulativo)</span>
          </div>
          <pre class="consola-body" id="output" style="min-height:200px; max-height:400px; overflow-y:auto;">// Esperando ejecución de pruebas...</pre>
        </div>
      </div>
    </div>
  `;

  const consola = raiz.querySelector('#output');

  function resaltarJSON(jsonStr) {
    if (!jsonStr) return '';
    let html = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'syntax-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) cls = 'syntax-key';
        else cls = 'syntax-string';
      } else if (/true|false/.test(match)) cls = 'syntax-boolean';
      else if (/null/.test(match)) cls = 'syntax-null';
      return '<span class="' + cls + '">' + match + '</span>';
    });
    return html;
  }

  // Función para definir colores según el código HTTP
  function getColorStatus(status) {
    if (status >= 200 && status < 300) return '#4ade80'; // Verde (200, 201)
    if (status >= 400 && status < 500) return '#fbbf24'; // Amarillo (400, 404)
    return '#f87171'; // Rojo (500+)
  }

  // Función para el fondo del badge según el código HTTP
  function getBadgeStyle(status) {
    if (status >= 200 && status < 300) return 'background:var(--success-light); color:var(--success)';
    if (status >= 400 && status < 500) return 'background:var(--warning-light); color:var(--warning)';
    return 'background:var(--danger-light); color:var(--danger)';
  }

  async function run(id) {
    const c = casos.find(x => x.id === id);
    const res = await llamarAPI(c.metodo, c.ruta, c.body, { registrar: true });
    
    // Actualizar badge en la fila con color según el código HTTP
    const badge = raiz.querySelector('#status-' + id);
    badge.textContent = res.status;
    badge.style.cssText = getBadgeStyle(res.status);
    
    // Verificar si la prueba pasó (código obtenido === código esperado)
    const pruebaPasó = (res.status === c.esperado);
    const colorCodigo = getColorStatus(res.status);
    const mensajePrueba = pruebaPasó ? '✓ PRUEBA EXITOSA' : '✗ PRUEBA FALLIDA';
    const colorPrueba = pruebaPasó ? '#4ade80' : '#f87171';
    
    const jsonFormateado = JSON.stringify(res.datos, null, 2);
    
    const bloque = `
<span style="color:#64748b;">--------------------------------------------------</span>
<span style="color:#38bdf8; font-weight:bold;">[${new Date().toLocaleTimeString()}]</span> 
<span style="color:#facc15; font-weight:bold;">${c.metodo}</span> <span style="color:#e2e8f0;">${c.ruta}</span> (${c.desc})
<span style="color:#e2e8f0;">Status: <strong style="color:${colorCodigo}">${res.status}</strong> | Resultado: <strong style="color:${colorPrueba}">${mensajePrueba}</strong></span>
<span style="color:#64748b;">--------------------------------------------------</span>
<span style="color:#e2e8f0;">${resaltarJSON(jsonFormateado)}</span>
\n`;

    if (consola.innerHTML.includes('// Esperando ejecución')) {
      consola.innerHTML = '';
    }
    consola.innerHTML += bloque;
    consola.scrollTop = consola.scrollHeight;
  }

  document.addEventListener('run-test', (e) => run(e.detail));
  
  raiz.querySelector('#btnRunAll').addEventListener('click', async (e) => {
    e.target.disabled = true;
    for (const c of casos) { await run(c.id); await esperar(300); }
    e.target.disabled = false;
  });

  raiz.querySelector('#btnClear').addEventListener('click', () => {
    consola.innerHTML = '// Esperando ejecución de pruebas...';
  });
}
