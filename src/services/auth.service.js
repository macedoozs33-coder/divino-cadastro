const AdminRepository = require('../repositories/admin.repository');
const PasswordHasher = require('../utils/passwordHasher');
const JwtService = require('../utils/jwtService');
const AppError = require('../utils/AppError');

function normalizarEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function emailsAdminPermitidos() {
  return String(process.env.ADMIN_EMAIL || '')
    .split(',')
    .map(normalizarEmail)
    .filter(Boolean);
}

function pareceHashBcrypt(valor) {
  return /^\$2[aby]\$\d{2}\$/.test(valor || '');
}

const AuthService = {
  async login({ email, senha }) {
    const emailNormalizado = normalizarEmail(email);
    const admin = await AdminRepository.buscarPorEmail(emailNormalizado);

    if (!admin) {
      throw new AppError('E-mail ou senha invalidos.', 401);
    }

    const adminPermitido = emailsAdminPermitidos().includes(emailNormalizado);
    const senhaCorreta = pareceHashBcrypt(admin.senha_hash)
      ? await PasswordHasher.comparar(senha, admin.senha_hash)
      : adminPermitido && senha === admin.senha_hash;

    if (!senhaCorreta) {
      throw new AppError('E-mail ou senha invalidos.', 401);
    }

    const token = JwtService.gerarToken({ sub: admin.id, email: admin.email });

    return {
      token,
      admin: { id: admin.id, nome: admin.nome, email: admin.email },
    };
  },
};

module.exports = AuthService;
