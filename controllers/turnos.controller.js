const service = require('../services/turnos.service');

const esTextoValido = (valor) => typeof valor === 'string' && valor.trim().length > 0;

function validarTurno(body) {
  const errores = [];
  const datos = body && typeof body === 'object' && !Array.isArray(body) ? body : {};

  if (!esTextoValido(datos.nombreCliente)) {
    errores.push('nombreCliente es obligatorio y debe ser texto');
  }
  if (!esTextoValido(datos.nombreMascota)) {
    errores.push('nombreMascota es obligatorio y debe ser texto');
  }
  if (!esTextoValido(datos.tipoServicio)) {
    errores.push('tipoServicio es obligatorio y debe ser texto');
  }

  if (datos.fechaHora === undefined || datos.fechaHora === null || datos.fechaHora === '') {
    errores.push('fechaHora es obligatoria');
  } else if (typeof datos.fechaHora !== 'string' || Number.isNaN(Date.parse(datos.fechaHora))) {
    errores.push('fechaHora debe ser una fecha válida en formato ISO (ej: 2026-12-01T10:30:00)');
  }

  if (datos.precioBase === undefined || datos.precioBase === null || datos.precioBase === '') {
    errores.push('precioBase es obligatorio');
  } else if (typeof datos.precioBase !== 'number' || !Number.isFinite(datos.precioBase)) {
    errores.push('precioBase debe ser un número');
  } else if (datos.precioBase <= 0) {
    errores.push('precioBase debe ser mayor que 0');
  }

  if (datos.prioritario !== undefined && typeof datos.prioritario !== 'boolean') {
    errores.push('prioritario debe ser true o false');
  }

  return errores;
}

// GET /api/turnos/config
exports.obtenerConfig = (req, res) => {
  res.status(200).json(service.obtenerConfig());
};

// GET /api/turnos
exports.listarTurnos = (req, res) => {
  res.status(200).json(service.obtenerTodos());
};

// GET /api/turnos/:id
exports.obtenerTurno = (req, res) => {
  const turno = service.obtenerPorId(req.params.id);
  if (!turno) {
    return res.status(404).json({ error: `No existe un turno con id ${req.params.id}` });
  }
  res.status(200).json(turno);
};

// POST /api/turnos
exports.crearTurno = (req, res) => {
  const errores = validarTurno(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ error: 'Datos de entrada inválidos', detalles: errores });
  }
  const nuevo = service.crear(req.body);
  res.status(201).json(nuevo);
};
