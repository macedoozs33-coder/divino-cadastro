const { Router } = require('express');

const router = Router();

// Endpoint simples para validar que a API está no ar.
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando corretamente.',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
