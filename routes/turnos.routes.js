const { Router } = require('express');
const controller = require('../controllers/turnos.controller');

const router = Router();

router.get('/config', controller.obtenerConfig);
router.get('/', controller.listarTurnos);
router.get('/:id', controller.obtenerTurno);
router.post('/', controller.crearTurno);

module.exports = router;
