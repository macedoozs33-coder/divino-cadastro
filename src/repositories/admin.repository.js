const supabase = require('../config/database');
const AppError = require('../utils/AppError');

/**
 * Camada de acesso a dados do Admin via Supabase.
 * Sem regra de negócio (isso fica no auth.service.js).
 */
const AdminRepository = {
  async criar(dados) {
    const { data, error } = await supabase
      .from('admins')
      .insert(dados)
      .select()
      .single();

    if (error) throw new AppError('Erro ao criar admin.', 500, error.message);
    return data;
  },

  async buscarPorEmail(email) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw new AppError('Erro ao buscar admin.', 500, error.message);
    return data;
  },

  async buscarPorId(id) {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new AppError('Erro ao buscar admin.', 500, error.message);
    return data;
  },
};

module.exports = AdminRepository;
