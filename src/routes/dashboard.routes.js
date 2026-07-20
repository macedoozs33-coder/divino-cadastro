const { Router } = require('express');
const DashboardController = require('../controllers/dashboard.controller');
const autenticar = require('../middlewares/autenticar');

const router = Router();

// Toda a área administrativa exige token válido.
router.use(autenticar);

router.get('/resumo', DashboardController.resumo);

module.exports = router;
