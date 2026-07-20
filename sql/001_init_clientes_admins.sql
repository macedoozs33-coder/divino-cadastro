-- Rode este script no SQL Editor do Supabase (ou via CLI: supabase db push).

create extension if not exists pgcrypto;

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  data_nascimento date not null,
  email text not null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists clientes_nome_idx on clientes (nome);
create index if not exists clientes_whatsapp_idx on clientes (whatsapp);
create index if not exists clientes_data_nascimento_idx on clientes (data_nascimento);

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  senha_hash text not null,
  criado_em timestamptz not null default now()
);

-- Mantém atualizado_em em dia automaticamente a cada UPDATE em clientes
create or replace function set_atualizado_em()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_clientes_atualizado_em on clientes;
create trigger trg_clientes_atualizado_em
  before update on clientes
  for each row
  execute function set_atualizado_em();

-- RLS habilitado por padrão no Supabase. O backend usa a service_role key,
-- que ignora RLS — por isso não criamos políticas aqui. Se no futuro o
-- frontend acessar o Supabase diretamente (sem passar pelo backend),
-- será necessário criar políticas específicas.
alter table clientes enable row level security;
alter table admins enable row level security;
