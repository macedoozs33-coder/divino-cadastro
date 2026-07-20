const { z } = require('zod');

const exportarClientesQuerySchema = z.object({
  busca: z.string().trim().min(1).optional(),
  mes: z.coerce.number().int().min(1).max(12).optional(),
});

module.exports = { exportarClientesQuerySchema };
