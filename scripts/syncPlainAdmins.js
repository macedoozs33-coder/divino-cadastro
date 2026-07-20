require('dotenv').config();

const supabase = require('../src/config/database');

const [, , senha] = process.argv;

function emailsAdminPermitidos() {
  return String(process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function nomePadrao(email) {
  return email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

async function main() {
  const emails = emailsAdminPermitidos();

  if (!senha || emails.length === 0) {
    console.log('Uso: npm run admin:sync-plain -- "senha123"');
    console.log('Defina ADMIN_EMAIL no .env com os emails separados por virgula.');
    process.exitCode = 1;
    return;
  }

  const admins = emails.map((email) => ({
    nome: nomePadrao(email),
    email,
    senha_hash: senha,
  }));

  const { data, error } = await supabase
    .from('admins')
    .upsert(admins, { onConflict: 'email' })
    .select('nome,email');

  if (error) {
    throw new Error(error.message);
  }

  console.log('Admins sincronizados com senha normal:');
  data.forEach((admin) => console.log(`- ${admin.nome} <${admin.email}>`));
}

main().catch((error) => {
  console.error('Erro ao sincronizar admins:', error.message);
  process.exitCode = 1;
});
