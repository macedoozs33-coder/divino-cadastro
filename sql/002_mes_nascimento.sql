-- Rode este script no SQL Editor do Supabase, depois do 001.
-- Adiciona uma coluna gerada com o mês de nascimento, para permitir
-- filtros eficientes (com índice) sem precisar de funções SQL customizadas
-- no meio das queries do backend.

alter table clientes
  add column if not exists mes_nascimento integer
  generated always as (extract(month from data_nascimento)) stored;

create index if not exists clientes_mes_nascimento_idx on clientes (mes_nascimento);
