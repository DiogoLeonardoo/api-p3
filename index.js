const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importa rotas
const instituicoesRouter = require('./routes/instituicao');
const alunosRouter = require('./routes/alunos');
const professoresRouter = require('./routes/professores');
const cursosRouter = require('./routes/curso');
const disciplinasRouter = require('./routes/disciplinas');
const tipoCursoRouter = require('./routes/tipo_curso');


// Swagger setup
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
        url: 'https://api-p3-production.up.railway.app',
      },
    ],
  },
  apis: ['./routes/*.js'], // aqui fica a documentação nas rotas
};

const specs = swaggerJsdoc(options);

// Rotas
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/instituicoes', instituicoesRouter);
app.use('/alunos', alunosRouter);
app.use('/professores', professoresRouter);
app.use('/cursos', cursosRouter);
app.use('/disciplinas', disciplinasRouter);
app.use('/tipocurso', tipoCursoRouter);

// Rota raiz (opcional)
app.get('/', (req, res) => {
  res.send('API Sistema Acadêmico rodando!');
});

// Porta
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
