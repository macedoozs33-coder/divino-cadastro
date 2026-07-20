/**
 * Erro de aplicação padronizado.
 * Deve ser usado por controllers/services para erros esperados
 * (validação, não encontrado, não autorizado, etc.), permitindo
 * que o middleware global de erros responda de forma consistente.
 */
class AppError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = AppError;
