import { escapar, fechaLegible, moneda } from '../utils.js';

export function tarjetaTurno(t) {
  return `
    <div class="turno ${t.prioritario ? 'prio' : ''}">
      <div class="turno-header">
        <div>
          <h3>${escapar(t.nombreMascota)}</h3>
          <span class="id">#${t.id}</span>
        </div>
        <span class="${t.prioritario ? 'badge-prio' : 'badge-normal'}">${t.prioritario ? 'Prioritario' : 'Normal'}</span>
      </div>
      <div class="turno-meta">
        <span>Dueño:</span> <strong>${escapar(t.nombreCliente)}</strong>
        <span>Servicio:</span> <strong>${escapar(t.tipoServicio)}</strong>
        <span>Fecha:</span> <strong>${escapar(fechaLegible(t.fechaHora))}</strong>
      </div>
      <div class="turno-footer">
        <span style="font-size:13px; color:var(--text-muted)">Total a pagar</span>
        <strong>${moneda(t.totalPagar)}</strong>
      </div>
    </div>
  `;
}
