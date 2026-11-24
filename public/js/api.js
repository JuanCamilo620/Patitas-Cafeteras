// Cliente de la API: único lugar donde se hacen peticiones al servidor
import { toast } from './utils.js';

export const estado = {
  config: { N: 1, porcentajeRecargo: 2 },
  servidor: 'conectando'
};

// Peticiones registradas (las usa el historial de la vista "Pruebas de la API")
export const historial = [];

const oyentes = [];

function marcarServidor(enLinea) {
  estado.servidor = enLinea ? 'en-linea' : 'sin-conexion';
  oyentes.forEach((fn) => fn(estado.servidor));
}

// Ejecuta la petición, mide el tiempo y (opcionalmente) la guarda en el historial.
// "crudo" envía el cuerpo tal cual, sin convertirlo a JSON (sirve para probar un JSON mal formado).
export async function llamarAPI(metodo, url, cuerpo, { registrar = false, crudo = false } = {}) {
  const inicio = performance.now();
  let respuesta;
  let datos;
  try {
    const opciones = { method: metodo, headers: {} };
    if (cuerpo !== undefined) {
      opciones.headers['Content-Type'] = 'application/json';
      opciones.body = crudo ? cuerpo : JSON.stringify(cuerpo);
    }
    respuesta = await fetch(url, opciones);
    const texto = await respuesta.text();
    try {
      datos = JSON.parse(texto);
    } catch (e) {
      datos = { respuestaNoJson: texto.slice(0, 200) };
    }
  } catch (e) {
    marcarServidor(false);
    toast('No se pudo conectar con el servidor', true);
    throw e;
  }
  const ms = Math.round(performance.now() - inicio);
  marcarServidor(true);
  const resultado = { metodo, url, cuerpo, status: respuesta.status, datos, ms };
  if (registrar) {
    historial.unshift(resultado);
    if (historial.length > 40) historial.pop();
  }
  return resultado;
}

// ---------- Funciones por endpoint ----------
export async function obtenerConfig() {
  const r = await llamarAPI('GET', '/api/turnos/config');
  estado.config = r.datos;
  return r.datos;
}

export async function listarTurnos() {
  const r = await llamarAPI('GET', '/api/turnos');
  return r.datos;
}

export function buscarTurnoPorId(id) {
  return llamarAPI('GET', `/api/turnos/${encodeURIComponent(id)}`, undefined, { registrar: true });
}

export function crearTurno(cuerpo) {
  return llamarAPI('POST', '/api/turnos', cuerpo, { registrar: true });
}

// Stub por compatibilidad (no se usa en el diseño nuevo)

