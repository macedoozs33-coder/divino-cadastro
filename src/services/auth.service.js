const AdminRepository = require('../repositories/admin.repository');
const PasswordHasher = require('../utils/passwordHasher');
const JwtService = require('../utils/jwtService');
const AppError = require('../utils/AppError');

const AuthService = {
  /**
   * Autentica um admin por email/senha e retorna o token JWT.
   * Lança AppError 401 se as credenciais forem inválidas.
   */
  async login({ email, senha }) {
    const admin = await AdminRepository.buscarPorEmail(email);

    // Mensagem genérica proposital: não revelar se o e-mail existe ou não.
    if (!admin) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    const senhaCorreta = await PasswordHasher.comparar(senha, admin.senha_hash);

    if (!senhaCorreta) {
      throw new AppError('E-mail ou senha inválidos.', 401);
    }

    const token = JwtService.gerarToken({ sub: admin.id, email: admin.email });

    return {
      token,
      admin: { id: admin.id, nome: admin.nome, email: admin.email },
    };
  },
};

module.exports = AuthService;
