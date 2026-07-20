-- Rode este script no SQL Editor do Supabase, após o 001.
-- Necessário porque o client JS do Supabase não expõe EXTRACT(MONTH FROM ...)
-- diretamente no query builder — usamos uma função SQL (RPC) para isso.

create or replace function contar_aniversariantes_mes(mes int)
returns bigint
language sql
stable
as $$
  select count(*)::bigint
  from clientes
  where extract(month from data_nascimento) = mes;
$$;
