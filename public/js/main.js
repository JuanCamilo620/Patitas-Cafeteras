// Punto de entrada de la interfaz: menú y navegación entre vistas
import { $, escapar } from './utils.js';
import { estado, obtenerConfig } from './api.js';
import * as inicio from './views/inicio.js';
import * as nuevo from './views/nuevo.js';
import * as turnos from './views/turnos.js';
import * as pruebas from './views/pruebas.js';
import * as proyecto from './views/proyecto.js';

const rutas = {
  inicio:   { vista: inicio,   titulo: 'Inicio' },
  nuevo:    { vista: nuevo,    titulo: 'Nuevo turno' },
  turnos:   { vista: turnos,   titulo: 'Turnos registrados' },
  pruebas:  { vista: pruebas,  titulo: 'Pruebas de la API' },
  proyecto: { vista: proyecto, titulo: 'El proyecto' }
};

let versionNavegacion = 0;

const abrirMenu = (abrir) => {
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('scrim');
  if (sidebar) sidebar.classList.toggle('abierto', abrir);
  if (scrim) scrim.classList.toggle('abierto', abrir);
};
const burger = document.getElementById('burger');
const scrim = document.getElementById('scrim');
if (burger) burger.addEventListener('click', () => abrirMenu(true));
if (scrim) scrim.addEventListener('click', () => abrirMenu(false));

function pintarConfig() {
  const chipN = document.getElementById('chipN');
  const chipRecargo = document.getElementById('chipRecargo');
  if (chipN) chipN.textContent = `N = ${estado.config.N}`;
  if (chipRecargo) chipRecargo.textContent = `Recargo prioritario: ${estado.config.porcentajeRecargo}%`;
}

async function navegar() {
  const clave = location.hash.replace('#/', '');
  if (!rutas[clave]) {
    location.replace('#/inicio');
    return;
  }
  const ruta = rutas[clave];
  const miVersion = ++versionNavegacion;

  document.querySelectorAll('.menu a').forEach((a) => {
    a.classList.toggle('activo', a.dataset.ruta === clave);
  });
  const titulo = document.getElementById('tituloPagina');
  if (titulo) titulo.textContent = ruta.titulo;
  document.title = `${ruta.titulo} · Patitas Cafeteras`;
  abrirMenu(false);

  const pagina = document.createElement('div');
  pagina.className = 'pagina';
  try {
    await ruta.vista.montar(pagina);
  } catch (e) {
    pagina.innerHTML = `<div class="card vacio">No se pudo cargar esta sección. Verifica que el servidor esté encendido (<code>npm start</code>).<br><small>${escapar(e.message)}</small></div>`;
  }
  if (miVersion !== versionNavegacion) return;
  document.getElementById('vista').replaceChildren(pagina);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', navegar);

(async function iniciar() {
  try {
    await obtenerConfig();
  } catch (e) {
    // sin servidor: cada vista mostrará su propio mensaje
  }
  pintarConfig();
  navegar();
})();
