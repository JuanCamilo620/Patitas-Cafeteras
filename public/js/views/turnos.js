import { listarTurnos, buscarTurnoPorId } from '../api.js';
import { escapar } from '../utils.js';
import { tarjetaTurno } from './componentes.js';

export async function montar(raiz) {
  let turnos = await listarTurnos();
  let filtro = 'todos';
  let texto = '';

  raiz.innerHTML = `
    <div class="card">
      <div class="card-body" style="display:flex; gap:16px; flex-wrap:wrap; align-items:center;">
        <input type="search" id="buscar" placeholder="Buscar por cliente o mascota…" style="flex:1; min-width:250px; margin:0;" />
        
        <div style="display:flex; border:1px solid var(--border); border-radius:8px; overflow:hidden;">
          <button data-filtro="todos" class="btn btn-sm btn-primary" style="border-radius:0;">Todos</button>
          <button data-filtro="prio" class="btn btn-sm btn-outline" style="border-radius:0; border:none; border-left:1px solid var(--border);">Prioritarios</button>
          <button data-filtro="normal" class="btn btn-sm btn-outline" style="border-radius:0; border:none; border-left:1px solid var(--border);">Normales</button>
        </div>
        
        <button id="actualizar" class="btn btn-outline">Refrescar</button>
      </div>
      <div class="card-body" style="border-top:1px solid var(--border); background:#fafbfc;">
        <form id="formId" style="display:flex; gap:12px; align-items:flex-end;">
          <label style="margin:0; flex:1; max-width:300px; font-size:13px;">Consultar por ID <span style="color:var(--text-muted); font-weight:400;">(GET /api/turnos/:id)</span>
            <input type="number" id="idBuscado" placeholder="Ej: 1" />
          </label>
          <button type="submit" class="btn btn-primary">Buscar</button>
        </form>
        <div id="resultadoId" style="margin-top:16px;"></div>
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h2 style="font-size:18px; font-weight:600;">Todos los turnos</h2>
      <span id="conteo" style="font-size:14px; color:var(--text-muted);"></span>
    </div>
    <div class="grid-2" id="lista"></div>
  `;

  const $c = (id) => raiz.querySelector('#' + id);

  function pintar() {
    const q = texto.trim().toLowerCase();
    const visibles = turnos
      .filter(t => filtro === 'todos' || (filtro === 'prio' ? t.prioritario : !t.prioritario))
      .filter(t => q === '' || [t.nombreCliente, t.nombreMascota].join(' ').toLowerCase().includes(q))
      .reverse();

    $c('conteo').textContent = `Mostrando ${visibles.length} turnos`;
    $c('lista').innerHTML = visibles.length === 0 
      ? '<p style="color:var(--text-muted)">No hay turnos.</p>' 
      : visibles.map(tarjetaTurno).join('');
  }

  $c('buscar').addEventListener('input', (e) => { texto = e.target.value; pintar(); });

  raiz.querySelectorAll('[data-filtro]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      filtro = e.target.dataset.filtro;
      raiz.querySelectorAll('[data-filtro]').forEach(b => {
        b.className = 'btn btn-sm btn-outline';
        b.style.borderLeft = '1px solid var(--border)';
      });
      e.target.className = 'btn btn-sm btn-primary';
      e.target.style.borderLeft = 'none';
      pintar();
    });
  });

  $c('actualizar').addEventListener('click', async () => {
    $c('actualizar').textContent = '...';
    turnos = await listarTurnos();
    pintar();
    $c('actualizar').textContent = 'Refrescar';
  });

  $c('formId').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $c('idBuscado').value.trim();
    if (!id) return;
    const { status, datos } = await buscarTurnoPorId(id);
    $c('resultadoId').innerHTML = status === 200 
      ? tarjetaTurno(datos) 
      : `<div style="color:var(--danger); padding:12px; background:var(--danger-light); border-radius:8px;">Error ${status}: ${escapar(datos.error)}</div>`;
  });

  pintar();
}
