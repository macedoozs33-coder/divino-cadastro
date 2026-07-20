const { z } = require('zod');

const CAMPOS_ORDENAVEIS = {
  nome: 'nome',
  whatsapp: 'whatsapp',
  dataNascimento: 'data_nascimento',
  criadoEm: 'criado_em',
};

const listarClientesQuerySchema = z
  .object({
    pagina: z.coerce.number().int().min(1).default(1),
    porPagina: z.coerce.number().int().min(1).max(100).default(10),
    busca: z.string().trim().min(1).optional(),
    mes: z.coerce.number().int().min(1).max(12).optional(),
    ordenarPor: z.enum(['nome', 'whatsapp', 'dataNascimento', 'criadoEm']).default('criadoEm'),
    ordem: z.enum(['asc', 'desc']).default('desc'),
  })
  .transform((query) => ({
    ...query,
    colunaOrdenacao: CAMPOS_ORDENAVEIS[query.ordenarPor],
  }));

module.exports = { listarClientesQuerySchema };
