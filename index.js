const express = require('express');
const path = require('path');
const turnosRoutes = require('./routes/turnos.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/turnos', turnosRoutes);

// Ruta de API inexistente -> 404 en JSON
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada', ruta: req.originalUrl });
});

// JSON mal formado u otros errores -> respuesta controlada, el servidor no se detiene
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`🐾 Patitas Cafeteras corriendo en http://localhost:${PORT}`);
});
