const { criarClienteSchema } = require('../utils/validators/cliente.validator');
const { listarClientesQuerySchema } = require('../utils/validators/listarClientes.validator');
const { exportarClientesQuerySchema } = require('../utils/validators/exportarClientes.validator');
const ClienteService = require('../services/cliente.service');
const { gerarExcelClientes } = require('../utils/excelGenerator');

function enviarExcel(res, buffer, nomeArquivo) {
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
  res.send(buffer);
}

const ClienteController = {
  async cadastrar(req, res) {
    const dados = criarClienteSchema.parse(req.body);
    const cliente = await ClienteService.cadastrar(dados);

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      cliente,
    });
  },

  async listar(req, res) {
    const opcoes = listarClientesQuerySchema.parse(req.query);
    const resultado = await ClienteService.listar(opcoes);

    res.json({ success: true, ...resultado });
  },

  async exportarFiltrados(req, res) {
    const filtros = exportarClientesQuerySchema.parse(req.query);
    const clientes = await ClienteService.exportarFiltrados(filtros);
    const buffer = await gerarExcelClientes(clientes);

    enviarExcel(res, buffer, 'clientes-filtrados.xlsx');
  },

  async exportarTodos(req, res) {
    const clientes = await ClienteService.exportarTodos();
    const buffer = await gerarExcelClientes(clientes);

    enviarExcel(res, buffer, 'clientes-todos.xlsx');
  },
};

module.exports = ClienteController;
