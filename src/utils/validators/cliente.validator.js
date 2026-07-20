const { z } = require('zod');

// Aceita datas no formato YYYY-MM-DD (input type="date" do frontend)
// e valida que realmente é uma data válida.
const dataNascimentoSchema = z
  .string()
  .refine((valor) => !Number.isNaN(Date.parse(valor)), {
    message: 'Data de nascimento inválida.',
  });

const criarClienteSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'O nome deve ter no mínimo 3 caracteres.')
    .max(120, 'O nome deve ter no máximo 120 caracteres.'),

  whatsapp: z
    .string()
    .trim()
    .regex(/^\d{10,11}$/, 'WhatsApp inválido. Use DDD + número, apenas dígitos (10 ou 11 números).'),

  dataNascimento: dataNascimentoSchema,

  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
});

module.exports = { criarClienteSchema };
