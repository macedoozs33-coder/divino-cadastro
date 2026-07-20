const JwtService = require('../utils/jwtService');
const AppError = require('../utils/AppError');

/**
 * Middleware que exige um JWT válido no header Authorization: Bearer <token>.
 * Em caso de sucesso, disponibiliza os dados do admin em req.admin.
 */
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token de acesso não informado.', 401);
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = JwtService.verificarToken(token);
    req.admin = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    throw new AppError('Token inválido ou expirado.', 401);
  }
}

module.exports = autenticar;
