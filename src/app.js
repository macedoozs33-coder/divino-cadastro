require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// Segurança básica de headers HTTP
app.use(helmet());

// CORS restrito ao domínio do frontend configurado no .env
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Todas as rotas da API ficam sob o prefixo /api
app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
