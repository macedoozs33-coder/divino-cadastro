const ExcelJS = require('exceljs');

/**
 * Gera um buffer .xlsx a partir de uma lista de clientes (formato do banco,
 * snake_case). Colunas: Nome, WhatsApp, Email, Data de Nascimento, Data de Cadastro.
 */
async function gerarExcelClientes(clientes) {
  const workbook = new ExcelJS.Workbook();
  const planilha = workbook.addWorksheet('Clientes');

  planilha.columns = [
    { header: 'Nome', key: 'nome', width: 30 },
    { header: 'WhatsApp', key: 'whatsapp', width: 18 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Data de Nascimento', key: 'dataNascimento', width: 20 },
    { header: 'Data de Cadastro', key: 'dataCadastro', width: 20 },
  ];

  planilha.getRow(1).font = { bold: true };

  clientes.forEach((cliente) => {
    planilha.addRow({
      nome: cliente.nome,
      whatsapp: cliente.whatsapp,
      email: cliente.email,
      dataNascimento: formatarData(cliente.data_nascimento),
      dataCadastro: formatarData(cliente.criado_em),
    });
  });

  return workbook.xlsx.writeBuffer();
}

function formatarData(valor) {
  if (!valor) return '';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return '';
  return data.toLocaleDateString('pt-BR');
}

module.exports = { gerarExcelClientes };
