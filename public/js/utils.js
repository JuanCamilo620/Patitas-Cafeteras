// Utilidades compartidas por todas las vistas

export const $ = (selector, raiz = document) => raiz.querySelector(selector);

export const moneda = (n) => '$' + Number(n).toLocaleString('es-CO');

export const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

// Escapa el texto escrito por el usuario antes de mostrarlo (evita inyección de HTML)
export function escapar(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function fechaLegible(iso) {
  return new Date(iso).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Bogota'
  });
}

export function toast(mensaje, error = false) {
  const t = document.createElement('div');
  t.className = 'toast' + (error ? ' error' : '');
  t.textContent = mensaje;
  document.getElementById('toasts').appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

export function textoEstado(status) {
  return { 200: 'OK', 201: 'Created', 400: 'Bad Request', 404: 'Not Found' }[status] || '';
}

export function claseBadge(status) {
  if (status === 201) return 'b201';
  if (status === 404) return 'b404';
  if (status >= 500) return 'b5';
  if (status >= 400) return 'b4';
  return 'b2';
}
