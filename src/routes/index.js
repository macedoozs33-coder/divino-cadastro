const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const clienteRoutes = require('./cliente.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = Router();

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
