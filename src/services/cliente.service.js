const ClienteRepository = require('../repositories/cliente.repository');

const ClienteService = {
  /**
   * Cadastra um novo cliente na área pública.
   * @param {{nome: string, whatsapp: string, dataNascimento: string, email: string}} dados
   */
  async cadastrar(dados) {
    const cliente = await ClienteRepository.criar({
      nome: dados.nome,
      whatsapp: dados.whatsapp,
      data_nascimento: dados.dataNascimento,
      email: dados.email,
    });

    return {
      id: cliente.id,
      nome: cliente.nome,
      criadoEm: cliente.criado_em,
    };
  },

  /** Listagem paginada para o painel administrativo. */
  async listar(opcoesDeQuery) {
    const { dados, total } = await ClienteRepository.listarPaginado(opcoesDeQuery);
    const { pagina, porPagina } = opcoesDeQuery;

    return {
      clientes: dados.map((c) => ({
        id: c.id,
        nome: c.nome,
        whatsapp: c.whatsapp,
        dataNascimento: c.data_nascimento,
        criadoEm: c.criado_em,
      })),
      paginacao: {
        pagina,
        porPagina,
        total,
        totalPaginas: Math.max(1, Math.ceil(total / porPagina)),
      },
    };
  },

  /** Exporta clientes filtrados (ou todos, se nenhum filtro for enviado). */
  async exportarFiltrados({ busca, mes }) {
    return ClienteRepository.listarParaExportacao({ busca, mes });
  },

  /** Exporta toda a base de clientes, ignorando qualquer filtro. */
  async exportarTodos() {
    return ClienteRepository.listarTodos();
  },
};

module.exports = ClienteService;
