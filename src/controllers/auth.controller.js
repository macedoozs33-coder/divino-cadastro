const { loginSchema } = require('../utils/validators/auth.validator');
const AuthService = require('../services/auth.service');

const AuthController = {
  async login(req, res) {
    const dados = loginSchema.parse(req.body);
    const resultado = await AuthService.login(dados);

    res.json({ success: true, ...resultado });
  },
};

module.exports = AuthController;
