const { z } = require('zod');

function criarDataUtc(valor) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);

  if (!partes) return null;

  const ano = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);
  const data = new Date(Date.UTC(ano, mes - 1, dia));

  if (
    data.getUTCFullYear() !== ano ||
    data.getUTCMonth() !== mes - 1 ||
    data.getUTCDate() !== dia
  ) {
    return null;
  }

  return data;
}

function calcularIdade(dataNascimento, hoje = new Date()) {
  const anoAtual = hoje.getUTCFullYear();
  const mesAtual = hoje.getUTCMonth();
  const diaAtual = hoje.getUTCDate();
  const anoNascimento = dataNascimento.getUTCFullYear();
  const mesNascimento = dataNascimento.getUTCMonth();
  const diaNascimento = dataNascimento.getUTCDate();

  let idade = anoAtual - anoNascimento;

  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
    idade -= 1;
  }

  return idade;
}

// Aceita datas no formato YYYY-MM-DD (input type="date" do frontend)
// e valida que realmente é uma data válida.
const dataNascimentoSchema = z
  .string()
  .refine((valor) => criarDataUtc(valor) !== null, {
    message: 'Data de nascimento inválida.',
  })
  .refine((valor) => {
    const data = criarDataUtc(valor);
    if (!data) return false;

    const idade = calcularIdade(data);
    return idade >= 17 && idade <= 120;
  }, {
    message: 'O cadastro é permitido apenas para pessoas de 17 a 120 anos.',
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
