-- Impede cadastros duplicados de clientes por e-mail ou WhatsApp.
-- Se este script falhar, verifique antes se ja existem dados duplicados.

create unique index if not exists clientes_email_lower_unique_idx
  on clientes (lower(email));

create unique index if not exists clientes_whatsapp_unique_idx
  on clientes (whatsapp);
