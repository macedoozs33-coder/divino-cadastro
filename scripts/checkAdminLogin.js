require('dotenv').config();

const bcrypt = require('bcryptjs');
const AdminRepository = require('../src/repositories/admin.repository');

const [, , email, senha] = process.argv;

function escapeSql(value) {
  return String(value).replace(/'/g, "''");
}

function mostrarAjuda() {
  console.log('Uso: npm run admin:check -- "email@exemplo.com" "senha123"');
}

async function main() {
  if (!email || !senha) {
    mostrarAjuda();
    process.exitCode = 1;
    return;
  }

  const emailNormalizado = email.trim().toLowerCase();
  const admin = await AdminRepository.buscarPorEmail(emailNormalizado);

  if (!admin) {
    console.log(`Admin nao encontrado na tabela admins com email: ${emailNormalizado}`);
    return;
  }

  const hashPareceBcrypt = /^\$2[aby]\$\d{2}\$/.test(admin.senha_hash || '');
  const senhaConfere = hashPareceBcrypt
    ? await bcrypt.compare(senha, admin.senha_hash)
    : false;

  console.log(`Admin encontrado: ${admin.nome} <${admin.email}>`);
  console.log(`senha_hash parece bcrypt: ${hashPareceBcrypt ? 'sim' : 'nao'}`);
  console.log(`senha confere: ${senhaConfere ? 'sim' : 'nao'}`);

  if (!senhaConfere) {
    const novoHash = await bcrypt.hash(senha, 10);
    console.log('\nPara corrigir esse admin, cole este SQL no Supabase SQL Editor:\n');
    console.log(`update admins
set senha_hash = '${escapeSql(novoHash)}'
where email = '${escapeSql(emailNormalizado)}';`);
    console.log('\nDepois rode o admin:check novamente com a mesma senha.\n');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Erro ao testar login do admin:', error.message);
  process.exitCode = 1;
});
