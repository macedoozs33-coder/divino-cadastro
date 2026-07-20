const AppError = require('../utils/AppError');

/**
 * Middleware global de erros. Deve ser o último middleware registrado.
 * Captura erros lançados em qualquer rota (inclusive assíncronos, graças
 * ao pacote express-async-errors) e retorna uma resposta padronizada.
 */
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details ?? undefined,
    });
  }

  // Erros de validação do Zod (usados nas próximas etapas)
  if (err?.name === 'ZodError') {
    return res.status(422).json({
      success: false,
      message: 'Dados inválidos.',
      details: err.errors,
    });
  }

  console.error('[Erro não tratado]', err);

  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor.',
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = { errorHandler, notFoundHandler };
