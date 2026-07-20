const bcrypt = require('bcryptjs');

const [, , nome, email, senha] = process.argv;

function escapeSql(value) {
  return String(value).replace(/'/g, "''");
}

function mostrarAjuda() {
  console.log('Uso: npm run admin:sql -- "Nome Admin" "email@exemplo.com" "senha123"');
}

async function main() {
  if (!nome || !email || !senha) {
    mostrarAjuda();
    process.exitCode = 1;
    return;
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  console.log('\nCole este SQL no SQL Editor do Supabase:\n');
  console.log(`insert into admins (nome, email, senha_hash)
values ('${escapeSql(nome)}', '${escapeSql(email)}', '${escapeSql(senhaHash)}')
on conflict (email)
do update set
  nome = excluded.nome,
  senha_hash = excluded.senha_hash;`);
  console.log('\nDepois faça login usando o email e a senha normal, nao o hash.\n');
}

main().catch((error) => {
  console.error('Erro ao gerar SQL do admin:', error);
  process.exitCode = 1;
});
