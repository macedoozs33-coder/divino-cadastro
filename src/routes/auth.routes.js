const { Router } = require('express');
const AuthController = require('../controllers/auth.controller');
const autenticar = require('../middlewares/autenticar');

const router = Router();

router.post('/login', AuthController.login);

// Rota de exemplo protegida, só para validar o middleware.
// Será removida/substituída quando o dashboard real for implementado.
router.get('/me', autenticar, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

module.exports = router;
