const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail invalido.'),
  senha: z.string().min(6, 'A senha deve ter no minimo 6 caracteres.'),
});

module.exports = { loginSchema };
