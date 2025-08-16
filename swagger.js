const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema Acadêmico',
      version: '1.0.0',
      description: 'Documentação da API do sistema acadêmico',
    },
    servers: [
      {
        url: 'api-p3-production.up.railway.app',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
