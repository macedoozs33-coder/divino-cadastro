const DashboardService = require('../services/dashboard.service');

const DashboardController = {
  async resumo(req, res) {
    const dados = await DashboardService.obterResumo();
    res.json({ success: true, ...dados });
  },
};

module.exports = DashboardController;
