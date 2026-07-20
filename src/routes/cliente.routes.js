const { Router } = require('express');
const ClienteController = require('../controllers/cliente.controller');
const autenticar = require('../middlewares/autenticar');

const router = Router();

// Rota pública — sem autenticação. Qualquer pessoa pode se cadastrar.
router.post('/', ClienteController.cadastrar);

// Rota administrativa — exige token válido.
router.get('/', autenticar, ClienteController.listar);

// Exportação — ambas protegidas.
router.get('/exportar/filtrados', autenticar, ClienteController.exportarFiltrados);
router.get('/exportar/todos', autenticar, ClienteController.exportarTodos);

module.exports = router;
