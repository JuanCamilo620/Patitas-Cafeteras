// ------------------------------------------------------------
// Parámetro N del equipo (Grupo 2 - martes)
// Integrantes ordenados por apellido: Arenas Villa (#1), Bedoya Calderon (#2), Patiño Jimenez (#9)
// El primero en el orden alfabético es Arenas Villa, número de lista oficial = 1  ->  N = 1
// ------------------------------------------------------------
const N = 1;
const PORCENTAJE_RECARGO = N * 2; // 2 %

// ------------------------------------------------------------
// Manejo de fechas en hora de Colombia (UTC-5, sin horario de verano)
// - Si la fecha llega SIN zona horaria (ej: 2026-12-05T15:30:00) se interpreta como hora de Colombia.
// - Si llega con zona (Z o +/-hh:mm) se respeta y se convierte a hora de Colombia.
// - Siempre se guarda como ISO con offset: 2026-12-05T15:30:00.000-05:00
// ------------------------------------------------------------
const OFFSET_COLOMBIA_MS = -5 * 60 * 60 * 1000;
const SIN_ZONA = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/;

const aHoraColombia = (texto) => {
  const base = SIN_ZONA.test(texto) ? `${texto}-05:00` : texto;
  const fecha = new Date(base);
  return new Date(fecha.getTime() + OFFSET_COLOMBIA_MS).toISOString().replace('Z', '-05:00');
};

// Almacenamiento en memoria
const turnos = [
  {
    id: 1,
    nombreCliente: 'María Fernanda López',
    nombreMascota: 'Max',
    tipoServicio: 'Baño y corte',
    fechaHora: '2026-12-01T09:00:00.000-05:00',
    precioBase: 50000,
    prioritario: false,
    porcentajeRecargo: 0,
    totalPagar: 50000
  },
  {
    id: 2,
    nombreCliente: 'Carlos Ramírez',
    nombreMascota: 'Luna',
    tipoServicio: 'Spa completo',
    fechaHora: '2026-12-01T11:00:00.000-05:00',
    precioBase: 80000,
    prioritario: true,
    porcentajeRecargo: PORCENTAJE_RECARGO,
    totalPagar: 80000 + (80000 * PORCENTAJE_RECARGO) / 100
  }
];
let siguienteId = turnos.length + 1;

exports.obtenerConfig = () => ({
  negocio: 'Patitas Cafeteras',
  actividad: 'Peluquería y spa canino',
  N,
  porcentajeRecargo: PORCENTAJE_RECARGO,
  zonaHoraria: 'America/Bogota (UTC-5)'
});

exports.obtenerTodos = () => turnos;

exports.obtenerPorId = (id) => turnos.find((t) => String(t.id) === String(id));

exports.crear = (datos) => {
  const prioritario = datos.prioritario === true;
  const precioBase = datos.precioBase;

  const porcentajeRecargo = prioritario ? PORCENTAJE_RECARGO : 0;
  const totalPagar = prioritario
    ? precioBase + (precioBase * porcentajeRecargo) / 100
    : precioBase;

  const nuevo = {
    id: siguienteId++,
    nombreCliente: datos.nombreCliente.trim(),
    nombreMascota: datos.nombreMascota.trim(),
    tipoServicio: datos.tipoServicio.trim(),
    fechaHora: aHoraColombia(datos.fechaHora),
    precioBase,
    prioritario,
    porcentajeRecargo,
    totalPagar
  };

  turnos.push(nuevo);
  return nuevo;
};
