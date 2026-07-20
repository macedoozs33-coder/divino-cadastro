const supabase = require('../config/database');
const AppError = require('../utils/AppError');

/**
 * Camada de acesso a dados do Cliente via Supabase.
 * Contém apenas operações básicas — sem regra de negócio.
 * Consultas mais complexas (paginação, busca, filtro por mês) serão
 * adicionadas na etapa de Listagem de Clientes.
 *
 * Convenção: os dados trafegam em snake_case (mesmo formato das colunas
 * do Postgres/Supabase). O mapeamento para camelCase, se necessário,
 * fica a cargo do service/controller.
 */
const ClienteRepository = {
  async criar(dados) {
    const { data, error } = await supabase
      .from('clientes')
      .insert(dados)
      .select()
      .single();

    if (error?.code === '23505') {
      throw new AppError('Já existe um cliente cadastrado com este e-mail ou WhatsApp.', 409);
    }

    if (error) throw new AppError('Erro ao criar cliente.', 500, error.message);
    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new AppError('Erro ao buscar cliente.', 500, error.message);
    return data;
  },

  async buscarPorEmail(email) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (error) throw new AppError('Erro ao buscar cliente.', 500, error.message);
    return data;
  },

  async buscarPorWhatsapp(whatsapp) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('whatsapp', whatsapp)
      .limit(1)
      .maybeSingle();

    if (error) throw new AppError('Erro ao buscar cliente.', 500, error.message);
    return data;
  },

  async contarTodos() {
    const { count, error } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true });

    if (error) throw new AppError('Erro ao contar clientes.', 500, error.message);
    return count;
  },

  async listarTodos() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw new AppError('Erro ao listar clientes.', 500, error.message);
    return data;
  },

  /** Conta aniversariantes de um mês (1-12), usando a coluna gerada mes_nascimento. */
  async contarAniversariantesDoMes(mes) {
    const { count, error } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .eq('mes_nascimento', mes);

    if (error) throw new AppError('Erro ao contar aniversariantes.', 500, error.message);
    return count;
  },

  /** Conta clientes cadastrados a partir de uma data (ex: início do mês atual). */
  async contarCadastradosDesde(dataInicio) {
    const { count, error } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .gte('criado_em', dataInicio);

    if (error) throw new AppError('Erro ao contar novos cadastros.', 500, error.message);
    return count;
  },

  /** Retorna os últimos N clientes cadastrados. */
  async listarUltimosCadastrados(limite = 5) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('criado_em', { ascending: false })
      .limit(limite);

    if (error) throw new AppError('Erro ao listar últimos clientes.', 500, error.message);
    return data;
  },

  /**
   * Listagem paginada para o painel administrativo.
   * @param {object} opcoes
   * @param {number} opcoes.pagina
   * @param {number} opcoes.porPagina
   * @param {string} [opcoes.busca] - busca por nome OU whatsapp (parcial, case-insensitive)
   * @param {number} [opcoes.mes] - filtra aniversariantes do mês (1-12)
   * @param {string} opcoes.colunaOrdenacao - coluna real do banco (já mapeada)
   * @param {'asc'|'desc'} opcoes.ordem
   */
  async listarPaginado({ pagina, porPagina, busca, mes, colunaOrdenacao, ordem }) {
    let query = supabase.from('clientes').select('*', { count: 'exact' });

    if (busca) {
      const termo = busca.replace(/[%_]/g, '\\$&');
      query = query.or(`nome.ilike.%${termo}%,whatsapp.ilike.%${termo}%`);
    }

    if (mes) {
      query = query.eq('mes_nascimento', mes);
    }

    const de = (pagina - 1) * porPagina;
    const ate = de + porPagina - 1;

    query = query.order(colunaOrdenacao, { ascending: ordem === 'asc' }).range(de, ate);

    const { data, count, error } = await query;

    if (error) throw new AppError('Erro ao listar clientes.', 500, error.message);
    return { dados: data, total: count };
  },

  /**
   * Busca todos os clientes que batem com os filtros (sem paginação),
   * usada exclusivamente para exportação em Excel.
   */
  async listarParaExportacao({ busca, mes } = {}) {
    let query = supabase.from('clientes').select('*').order('criado_em', { ascending: false });

    if (busca) {
      const termo = busca.replace(/[%_]/g, '\\$&');
      query = query.or(`nome.ilike.%${termo}%,whatsapp.ilike.%${termo}%`);
    }

    if (mes) {
      query = query.eq('mes_nascimento', mes);
    }

    const { data, error } = await query;

    if (error) throw new AppError('Erro ao exportar clientes.', 500, error.message);
    return data;
  },
};

module.exports = ClienteRepository;
