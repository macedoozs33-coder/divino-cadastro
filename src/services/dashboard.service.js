const ClienteRepository = require('../repositories/cliente.repository');

/** Retorna o primeiro dia do mês atual, em ISO, para o filtro de "novos cadastros". */
function inicioDoMesAtual() {
  const agora = new Date();
  return new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString();
}

const DashboardService = {
  async obterResumo() {
    const mesAtual = new Date().getMonth() + 1; // getMonth() é 0-indexado

    const [totalClientes, aniversariantesDoMes, novosCadastros, ultimosClientes] = await Promise.all([
      ClienteRepository.contarTodos(),
      ClienteRepository.contarAniversariantesDoMes(mesAtual),
      ClienteRepository.contarCadastradosDesde(inicioDoMesAtual()),
      ClienteRepository.listarUltimosCadastrados(5),
    ]);

    return {
      totalClientes,
      aniversariantesDoMes,
      novosCadastros,
      ultimosClientes: ultimosClientes.map((c) => ({
        id: c.id,
        nome: c.nome,
        whatsapp: c.whatsapp,
        criadoEm: c.criado_em,
      })),
    };
  },
};

module.exports = DashboardService;
