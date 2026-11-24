import { crearTurno, estado } from '../api.js';
import { moneda, toast } from '../utils.js';
import { tarjetaTurno } from './componentes.js';

export async function montar(raiz) {
  raiz.innerHTML = `
    <div class="grid-form">
      <div class="card">
        <div class="card-header"><h2>Datos del Turno</h2></div>
        <div class="card-body">
          <form id="formTurno">
            <label>Nombre del cliente <input type="text" id="nombreCliente" placeholder="Ej: Laura Gómez" /></label>
            <label>Nombre de la mascota <input type="text" id="nombreMascota" placeholder="Ej: Toby" /></label>
            
            <div class="fila-2">
              <label>Servicio
                <select id="tipoServicio">
                  <option value="Baño">Baño</option>
                  <option value="Corte">Corte</option>
                  <option value="Spa completo">Spa completo</option>
                </select>
              </label>
              <label>Fecha y hora <input type="datetime-local" id="fechaHora" /></label>
            </div>
            
            <label>Precio base (COP) <input type="number" id="precioBase" placeholder="50000" step="1000" /></label>
            
            <label class="switch">
              <input type="checkbox" id="prioritario" />
              <span class="slider"></span>
              <span>Atención prioritaria (+${estado.config.porcentajeRecargo}%)</span>
            </label>

            <div id="errores" class="hidden"></div>
            
            <div style="display:flex; gap:12px; margin-top:24px;">
              <button type="submit" class="btn btn-primary">Registrar turno</button>
              <button type="button" class="btn btn-outline" id="btnEjemplo">Rellenar ejemplo</button>
            </div>
          </form>
        </div>
      </div>

      <div>
        <div class="card">
          <div class="card-header"><h2>Tarifa estimada</h2></div>
          <div class="card-body">
            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:14px;"><span>Precio base</span><strong id="pvBase">$0</strong></div>
            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:14px;"><span>Recargo</span><strong id="pvRecargo">0%</strong></div>
            <div style="display:flex; justify-content:space-between; padding-top:12px; border-top:1px solid var(--border); font-size:18px; font-weight:700; color:var(--primary);"><span>Total</span><strong id="pvTotal">$0</strong></div>
            <p style="font-size:12px; color:var(--text-muted); margin-top:16px;">El cálculo final lo hace el servidor.</p>
          </div>
        </div>
        <div id="confirmacion" class="hidden"></div>
      </div>
    </div>
  `;

  const $c = (id) => raiz.querySelector('#' + id);

  function actualizarPreview() {
    const base = parseFloat($c('precioBase').value) || 0;
    const prio = $c('prioritario').checked;
    const pct = prio ? estado.config.porcentajeRecargo : 0;
    const total = base + (base * pct) / 100;
    $c('pvBase').textContent = moneda(base);
    $c('pvRecargo').textContent = pct + '%';
    $c('pvTotal').textContent = moneda(total);
  }
  ['precioBase', 'prioritario'].forEach(id => $c(id).addEventListener('input', actualizarPreview));

  $c('btnEjemplo').addEventListener('click', () => {
    $c('nombreCliente').value = 'Carlos Ramírez';
    $c('nombreMascota').value = 'Luna';
    $c('tipoServicio').value = 'Spa completo';
    $c('fechaHora').value = '2026-12-05T15:30';
    $c('precioBase').value = 50000;
    $c('prioritario').checked = true;
    actualizarPreview();
  });

  $c('formTurno').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fecha = $c('fechaHora').value;
    const cuerpo = {
      nombreCliente: $c('nombreCliente').value,
      nombreMascota: $c('nombreMascota').value,
      tipoServicio: $c('tipoServicio').value,
      fechaHora: fecha.length === 16 ? fecha + ':00' : fecha,
      precioBase: Number($c('precioBase').value),
      prioritario: $c('prioritario').checked
    };

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    try {
      const { status, datos } = await crearTurno(cuerpo);
      const cajaError = $c('errores');

      if (status === 201) {
        cajaError.classList.add('hidden');
        $c('formTurno').reset();
        actualizarPreview();
        const conf = $c('confirmacion');
        conf.innerHTML = `<div class="card" style="border-color:var(--success);"><div class="card-header" style="background:var(--success-light);"><h2 style="color:var(--success); border:none;">Turno #${datos.id} registrado</h2></div><div class="card-body">${tarjetaTurno(datos)}</div></div>`;
        conf.classList.remove('hidden');
        toast(`Turno #${datos.id} registrado`);
      } else {
        // BLINDAJE DEL ERROR: Si el backend no manda detalles, mostrar el mensaje general.
        let htmlError = `<strong>Error ${status}:</strong> ${datos.error || 'Error en la validación de datos'}`;
        
        if (datos.detalles && Array.isArray(datos.detalles) && datos.detalles.length > 0) {
          htmlError += `<ul>${datos.detalles.map(d => `<li>${d}</li>`).join('')}</ul>`;
        }
        
        cajaError.innerHTML = htmlError;
        cajaError.className = 'alerta-error';
        cajaError.classList.remove('hidden');
      }
    } catch (err) {
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Registrar turno';
    }
  });
}
